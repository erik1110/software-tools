# Shell expansion

This exercise is about studying shell expansion. You should run it on your Debian VM in Vagrant.

Create a C program `arguments.c` with the following contents. You can use `nano arguments.c` for this, for example.

```C
#include <stdio.h>

int main(int argc, char** argv) {
  for(int i=0; i < argc; i++) {
    printf("Argument #%i: [%s]\n", i, argv[i]);
  }
  return 0;
}
```

Compile this with `gcc -Wall arguments.c -o arguments`. 

## Whitespace

The program prints all its arguments, one per line. The program gets its arguments from the program that started it - in this case the shell.
Try running the program with the following commands:

    ./arguments
    ./arguments hello
    ./arguments one two three

Now that you are familiar with what the program does, try the following:

    ./arguments one       two
    ./arguments "one two"
    ./arguments "one      two"

How, based on these examples, does the shell handle whitespace in the line you type?

## Pattern matching

Try the following:

  * `./arguments *` in the folder that contains the arguments program, and its source code arguments.c.
  * Make an empty subfolder with `mkdir empty`, switch to it with `cd empty` and then run `../arguments *`. Since you are now in the subfolder, we need two dots at the start to say "run the program arguments from the folder _above_". What happens?
  * Go back to the folder with the program by running `cd ..` and then do `ls` to check you're back in the right folder. In this folder, find three different ways to get the program to produce the following output:

```
Argument #0: [./arguments]
Argument #1: [*] 
```

Summary of Behavior in Bash
Without quotes (e.g., ./arguments *):

Bash expands * to match all files in the directory.
If the directory is empty, * is passed as a literal string.
With quotes or escape (e.g., '*', "*", \*):

Bash passes * as a literal string without attempting to expand it.
This behavior ensures you have multiple ways to control how * is interpreted.

## Files with spaces in their names

The command `touch FILENAME` creates a file. Create a file with a space in its name by typing `touch "silly named file"`. What would happen if you left the quotes off (you can try it, then do `ls`)?

Start typing `ls sill` and then press TAB to autocomplete. Assuming you have no other files whose name starts with _sill_, what happens? Use this method to get the arguments program to print the following:

```
Argument #0: [./arguments]
Argument #1: [Hello world!] 
```

The command `rm` (remove) deletes files again. Use it to remove your file with spaces in its name, using one of several methods to get the shell to pass the spaces through to `rm`.


### **Step 1: Creating a file with a space in its name**
```bash
touch "silly named file"
```
- **What happens:** The quotes tell the shell to treat `silly named file` as a single string (a single filename). This creates a file named `silly named file`.

#### **Without quotes:**
```bash
touch silly named file
```
- **What happens:** Without quotes, the shell interprets `silly`, `named`, and `file` as three separate arguments. This would attempt to create three files: `silly`, `named`, and `file`.

**Check with:**
```bash
ls
```
- You’ll see either one file (`silly named file`) or three files (`silly`, `named`, and `file`) depending on whether quotes were used.

---

### **Step 2: Using `ls` with autocomplete**
1. Start typing:
   ```bash
   ls sill
   ```
2. Press the `TAB` key to autocomplete.
   - If no other files start with `sill`, the shell will complete the filename. For a file with spaces (e.g., `silly named file`), Bash will escape the spaces with backslashes:
     ```bash
     ls silly\ named\ file
     ```

**Explanation:**
- The shell escapes spaces with `\` to treat the filename as a single entity.
- Alternatively, you could also enclose the name in quotes:
  ```bash
  ls "silly named file"
  ```

---

### **Step 3: Running `arguments` to produce specific output**
You want the program `arguments` to print:
```plaintext
Argument #0: [./arguments]
Argument #1: [Hello world!]
```

#### **Method 1: Use quotes**
```bash
./arguments "Hello world!"
```
- The quotes treat `Hello world!` as a single argument, preserving the space.

**Output:**
```plaintext
Argument #0: [./arguments]
Argument #1: [Hello world!]
```

#### **Method 2: Escape the space**
```bash
./arguments Hello\ world!
```
- The backslash escapes the space, so the shell treats `Hello world!` as a single argument.

**Output:**
```plaintext
Argument #0: [./arguments]
Argument #1: [Hello world!]
```

#### **Method 3: Use a variable**
```bash
arg="Hello world!"
./arguments "$arg"
```
- By storing the string in a variable and quoting it, you ensure the shell passes it as a single argument.

**Output:**
```plaintext
Argument #0: [./arguments]
Argument #1: [Hello world!]
```

---

### **Step 4: Deleting a file with spaces in its name**
The command `rm` removes files. If the file has spaces in its name, you must handle the spaces correctly.

#### **Method 1: Use quotes**
```bash
rm "silly named file"
```

#### **Method 2: Use escape characters**
```bash
rm silly\ named\ file
```

#### **Method 3: Use autocomplete**
- Start typing `rm sill` and press `TAB`. The shell will autocomplete the file name (escaping the spaces), and you can press `ENTER` to delete it.

---

### **Summary**
1. Use quotes or escape spaces to handle filenames with spaces.
2. The shell autocompletes filenames with spaces by escaping the spaces with backslashes.
3. You can use any method (quotes, escaping, or variables) to pass strings with spaces as arguments or delete files with spaces in their names.





## Shell variables

In the shell, `VARIABLE=VALUE` sets a variable to a value and `$VARIABLE` retrieves its value. For example, to save typing a filename twice:

    p=arguments
    gcc -Wall $p.c -o $p

which expands to `gcc -Wall arguments.c -o arguments`. If you want to use a variable inside a word, you can use curly braces: `${a}b` means the value of the variable `a` followed by the letter b, whereas `$ab` would mean the value of the variable `ab`.

It is good practice to double-quote variables used like this, because if you tried for example to compile a program called `silly name.c` with a space in its name, then

    program="silly name"
    gcc -Wall $program.c -o $program

would expand to

    gcc -Wall silly name.c -o silly name

and this would confuse your compiler because you are telling it to compile three source files called `silly`, `name.c` and `name` to a program called `silly`. Correct would be:

    program="silly name"
    gcc -Wall "$program.c" -o "$program"

which expands to

    gcc -Wall "silly name.c" -o "silly name"

which does what you want - if you indeed want a program with a space in its name!

There is no harm in double-quoting a shell variable every time you want to use it, and this is good practice as it still works if the variable is set to a value that contains spaces.

Note that we also had to quote setting the variable name in the first place, because

    program=silly name

would translate as: set the variable `program` to the value `silly`, then execute the program `name`. Variable assignments only apply to the first argument following them, although you can assign more than one variable.

Note that this does not work as expected either:

    file=arguments gcc -Wall "$file.c" -o "$file"

The problem here is that the shell first reads the line and substitutes in the value of `$file` (unset variables expand to the empty string by default) before starting to execute the command, so you are reading the variable's value before writing it. Leaving off the quotes doesn't help: you need to set the variable on a separate line.
