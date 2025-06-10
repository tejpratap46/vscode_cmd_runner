# File Runner with Arguments

A VS Code extension that adds a run button to execute the current file in the terminal with arguments read from a configuration file in the same folder.

## Features

- **Run Button**: Adds a play button (▶️) to the editor toolbar for supported file types
- **Argument Support**: Automatically reads arguments from configuration files in the same directory
- **Multi-language Support**: Supports JavaScript, Python, Java, C/C++, Go, Rust, Ruby, PHP, Shell scripts, and TypeScript
- **Smart Argument Detection**: Looks for argument files in this priority order:
  1. `args.txt`
  2. `<filename>.args` (e.g., `main.py` → `main.args`)
  3. `run.args`
  4. `arguments.txt`

## Supported File Types

- **JavaScript** (`.js`) - `node filename.js args`
- **TypeScript** (`.ts`) - `npx ts-node filename.ts args`
- **Python** (`.py`) - `python filename.py args`
- **Java** (`.java`) - `javac filename.java && java ClassName args`
- **C++** (`.cpp`, `.cc`, `.cxx`) - `g++ filename.cpp -o executable && ./executable args`
- **C** (`.c`) - `gcc filename.c -o executable && ./executable args`
- **Go** (`.go`) - `go run filename.go args`
- **Rust** (`.rs`) - `rustc filename.rs && ./executable args`
- **Ruby** (`.rb`) - `ruby filename.rb args`
- **PHP** (`.php`) - `php filename.php args`
- **Shell** (`.sh`) - `bash filename.sh args`

## Usage

1. **Create an argument file** in the same directory as your code:
   ```
   # args.txt
   --input data.txt --output result.txt --verbose
   ```

2. **Click the run button** (▶️) in the editor toolbar, or
3. **Right-click** in the editor and select "Run File with Args"

## Example

For a Python file `calculator.py`:

**calculator.py**
```python
import sys

def main():
    if len(sys.argv) < 3:
        print("Usage: python calculator.py <num1> <num2>")
        return
    
    num1 = float(sys.argv[1])
    num2 = float(sys.argv[2])
    print(f"Sum: {num1 + num2}")

if __name__ == "__main__":
    main()
```

**args.txt** (in same folder)
```
5.5 3.2
```

Clicking the run button will execute: `python calculator.py 5.5 3.2`

## Installation

1. Copy the extension files to your development folder
2. Open the folder in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to launch a new Extension Development Host window
5. Test the extension with your files

## Building for Distribution

1. Install vsce: `npm install -g vsce`
2. Package: `vsce package`
3. Install the generated `.vsix` file: `code --install-extension file-runner-with-args-1.0.0.vsix`

## Requirements

- The appropriate runtime/compiler for your file type must be installed and available in PATH
- VS Code 1.74.0 or higher

## Configuration Files Priority

The extension looks for argument files in this order:
1. `args.txt` - General arguments file
2. `<filename>.args` - File-specific arguments (e.g., `main.py` → `main.args`)
3. `run.args` - Alternative general arguments file
4. `arguments.txt` - Another alternative arguments file

Only the first found file will be used for arguments.