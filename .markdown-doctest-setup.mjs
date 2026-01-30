import { transformSync } from '@swc/core';
// eslint-disable-next-line import/extensions
import * as DreadCabinet from './dist/dreadcabinet.js'; // Adjusted path
import { Command } from 'commander';
import * as Cardigantime from '@utilarium/cardigantime';
import { z } from 'zod';

const mockProcess = {
    argv: ['node', 'test'], // Default argv
    stdout: {
        write: () => { }, // Mock stdout.write
    },
    stderr: {
        write: () => { }, // Mock stderr.write
    },
    exit: () => { },    // Mock process.exit
};

export default {
    "globals": {
        'process': mockProcess,
        'exports': {},
        'module': { exports: {} }
    },
    "require": {
        '@utilarium/dreadcabinet': DreadCabinet, // Adjusted key and value
        'commander': { Command },
        '@utilarium/cardigantime': Cardigantime,
        'zod': { z }
    },
    transformCode: (code) => {
        const getBlocks = (originalCode) => {
            const lines = originalCode.split('\n');
            let importLines = [];
            let mainLines = [];
            let inImportSection = true;

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (inImportSection) {
                    // Keep import, export, comments, and empty lines in the import block
                    if (trimmedLine.startsWith('import ') ||
                        trimmedLine.startsWith('export ') ||
                        trimmedLine.startsWith('//') ||
                        trimmedLine === '') {
                        importLines.push(line);
                    } else {
                        inImportSection = false;
                        mainLines.push(line);
                    }
                } else {
                    mainLines.push(line);
                }
            }
            return {
                importBlock: importLines.join('\n'),
                mainCodeBlock: mainLines.join('\n')
            };
        };

        const { importBlock, mainCodeBlock } = getBlocks(code);
        let codeToTransform = code; // Default to original code

        const trimmedMainCode = mainCodeBlock.trim();
        // Only wrap if 'await' is present in the executable part of the main code block.
        if (mainCodeBlock.includes('await') && trimmedMainCode !== '' && !trimmedMainCode.startsWith('//')) {
            let wrappedMainCode = trimmedMainCode;
            // Avoid double-wrapping an already existing async IIFE
            if (!(trimmedMainCode.startsWith('(async () => {') && trimmedMainCode.endsWith('})();'))) {
                wrappedMainCode = `(async () => {\n${trimmedMainCode}\n})();`;
            }

            // Reconstruct the code
            if (importBlock.trim() === '') {
                // No substantial import block, so the code is just the wrapped main part.
                codeToTransform = wrappedMainCode;
            } else {
                // We have a non-empty import block.
                // Ensure it ends with one newline, then append the wrapped main code.
                codeToTransform = importBlock.trimEnd() + '\n' + wrappedMainCode;
            }
        }
        // If no wrapping occurred, codeToTransform remains the original 'code'.

        const swcOptions = {
            filename: 'test.ts',
            jsc: {
                parser: {
                    syntax: 'typescript',
                    tsx: false,
                },
                target: 'es2024',
                preserveAllComments: true,
            },
            module: {
                type: 'commonjs',
            },
            sourceMaps: false,
        };

        try {
            const transformed = transformSync(codeToTransform, swcOptions);
            // Fallback to codeToTransform if transformation somehow fails or returns nothing
            return transformed?.code || codeToTransform;
        } catch (error) {
            // Non-JS/TS code (like bash) will fail to parse - just return it unchanged
            // Only log if it looks like it should be valid JS/TS (has import/export/const/let/var/function)
            const looksLikeJS = /^(import|export|const|let|var|function|class|async)\s/.test(codeToTransform.trim());
            if (looksLikeJS) {
                // eslint-disable-next-line no-console
                console.error("SWC transformation error in markdown-doctest-setup:", error);
            }
            // Return the original code to let the doctest runner handle it
            return codeToTransform;
        }
    }
} 