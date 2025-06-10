import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('fileRunner.runWithArgs', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active file to run');
            return;
        }

        const currentFile = activeEditor.document.fileName;
        const currentDir = path.dirname(currentFile);
        const fileName = path.basename(currentFile);
        const fileExtension = path.extname(currentFile);
        
        // Look for argument files in the same directory
        const argFiles = [
            path.join(currentDir, 'args.txt'),
            path.join(currentDir, `${path.basename(currentFile, fileExtension)}.args`),
            path.join(currentDir, 'run.args'),
            path.join(currentDir, 'arguments.txt')
        ];
        
        let args = '';
        let argsFile = '';
        
        // Find the first existing argument file
        for (const argFile of argFiles) {
            if (fs.existsSync(argFile)) {
                try {
                    args = fs.readFileSync(argFile, 'utf8').trim();
                    argsFile = path.basename(argFile);
                    break;
                } catch (error) {
                    console.error(`Error reading ${argFile}:`, error);
                }
            }
        }
        
        // Get the appropriate run command based on file extension
        const runCommand = getRunCommand(currentFile, args);
        
        if (!runCommand) {
            vscode.window.showErrorMessage(`Unsupported file type: ${fileExtension}`);
            return;
        }
        
        // Create or show terminal
        const terminalName = 'File Runner';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
        }
        
        // Change to file directory and run command
        terminal.sendText(`cd "${currentDir}"`);
        
        if (args) {
            vscode.window.showInformationMessage(`Running ${fileName} with args from ${argsFile}`);
            terminal.sendText(runCommand);
        } else {
            vscode.window.showInformationMessage(`Running ${fileName} (no args file found)`);
            terminal.sendText(runCommand.replace(' ' + args, ''));
        }
        
        terminal.show();
    });

    context.subscriptions.push(disposable);
}

function getRunCommand(filePath: string, args: string): string | null {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    
    switch (ext) {
        case '.js':
            return `node "${fileName}" ${args}`;
        case '.ts':
            return `npx ts-node "${fileName}" ${args}`;
        case '.py':
            return `python "${fileName}" ${args}`;
        case '.java':
            const className = path.basename(fileName, '.java');
            return `javac "${fileName}" && java ${className} ${args}`;
        case '.cpp':
        case '.cc':
        case '.cxx':
            const cppExe = path.basename(fileName, ext);
            return `g++ "${fileName}" -o "${cppExe}" && ./"${cppExe}" ${args}`;
        case '.c':
            const cExe = path.basename(fileName, '.c');
            return `gcc "${fileName}" -o "${cExe}" && ./"${cExe}" ${args}`;
        case '.go':
            return `go run "${fileName}" ${args}`;
        case '.rs':
            return `rustc "${fileName}" && ./"${path.basename(fileName, '.rs')}" ${args}`;
        case '.rb':
            return `ruby "${fileName}" ${args}`;
        case '.php':
            return `php "${fileName}" ${args}`;
        case '.sh':
            return `bash "${fileName}" ${args}`;
        default:
            return null;
    }
}

export function deactivate() {}