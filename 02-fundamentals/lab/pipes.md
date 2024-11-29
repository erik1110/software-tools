# Pipes

The command `ls | head` runs `ls` and `head` and pipes the standard output of ls
into the standard input of head. This 'piping' of output to input is the basis
of composability between Unix tools, and allows you to combine single tools into
a toolchain that produces a specific outcome. 

The following shell commands are particularly useful in pipes:

  - `cat [FILENAME [FILENAME...]]` writes the contents of one or more files to standard output. This is a good way of starting a pipe. If you leave off all the filenames, cat just reads its standard input and writes it to standard output.
  - `head [-n N]` reads its standard input and writes only the first N lines (default is 10 if you leave the option off) to standard output. You can also put a minus before the argument e.g. `head -n -2` to _skip the last 2 lines_ and write all the rest.
  - `tail [-n N]` is like head except that it writes the last N lines (with a minus, it skips the first N ones).
  - `sort` reads all its standard input into a memory buffer, then sorts the lines and writes them all to standard output.
  - `uniq` reads standard input and writes to standard output, but skips repeated lines that immediately follow each other, for example if there are three lines A, A, B then it would only write A, B but if it gets A, B, A it would write all three. A common way to remove duplicate lines is `... | sort | uniq | ...`.
  - `wc [-l]` stands for word count, but with `-l` it counts lines instead. Putting a `wc -l` on the very end of a pipe is useful if you just want to know how many results a particular command or pipe produces, assuming the results come one per line.

All these commands actually take an optional extra filename as argument, in which case they read from this file as input. For example, to display the first 10 lines of a file called `Readme.txt`, you could do either `cat Readme.txt | head` or `head Readme.txt`.

## Word list exercises - pipes

Most Linux distributions (including Debian) come with a dictionary file `/usr/share/dict/words` that contains a list of English words in alphabetical order, for use in spell-checking programs. The list includes a selection of proper nouns, for example countries and cities. 

(If you want to look at this list on a system that doesn't have it already, you
can download a version with `wget https://users.cs.duke.edu/~ola/ap/linuxwords
-O words` -- but the file might be slightly different from the Debian installed
version)

Find one-line commands, possibly with pipes, to print the following to your
terminal. You can either start each command with `cat /usr/share/dict/words |
...` or do it without cat by providing the words file as an argument to the
first command in your pipeline.

  * The first word in the file.
    ```
    head -n 1 words
    ```
  * The last word in the file.
    ```
    tail -n 1 word
    ```
  * The number of words in the words file - there is one word per line.
    ```
    wc -l words
    ```
  * The 6171st word in the file.
    ```
    sed -n '6171p' words
    ```
  * The first five words that are among the last 100 words on the list.
    ```
    tail -n 100 words | head -n 5
    ```
  * The last ten words in the file, sorted in reverse order.
    ```
    tail -n 10 words | sort -r
    ```
  
## Redirection

Find a directory on your VM that contains some files, and is writeable by your
current user (e.g., your `/shared` directory, or your `vagrant` user's home
directory). `cd` to that directory.

 * `ls -l` prints a detailed listing of the directory to standard output.
   Redirect this listing to instead store it in a file called `tmp` _(if you
don't know how, revist the second video+slides on piping)_.
 * If you inspect the file content (e.g., by `cat tmp`) and compare it to what
   you see when re-typing `ls -l` now, you should be able to find a difference.
However, it's a small difference and might be hard to spot. Let's use a tool
designed to help spot small differences between files. The `diff` utility takes
in (at least) two filenames and produces output that compares the two files
(feel free to test this elsewhere).  We have one file, `tmp`, but the thing we
want diff to compare against is _the result of executing ls -l again right now_,
not a file. Can you figure out how to redirect `ls -l` output to `diff` so it
compares it with `tmp`? 
 * The `diff` output is also appearing on standard output. Redirect it to a file
   `difflog` like you did for `ls -l` before. By creating this file, we're
changing what `ls` will report about this directory. Let's keep track of that
change by running the same `diff` command again, but this time _appending_ the
new output to `difflog`.  Inspect the resulting file and see what it tells you
about the changes.


Let's break down the steps and tasks involved in this exercise:

### Step 1: Redirect `ls -l` output to a file called `tmp`

1. **Navigate to the directory** that contains files and is writable by your current user. For example, you might use your `/shared` directory or the home directory of your `vagrant` user.

   ```bash
   cd /path/to/your/directory
   ```

2. **Use `ls -l` to list the directory contents** and redirect the output to a file called `tmp`:

   ```bash
   ls -l > tmp
   ```

   This command takes the detailed directory listing and stores it in the `tmp` file instead of displaying it on the terminal.

3. **Inspect the contents of `tmp`** to compare it with the output of `ls -l`:

   ```bash
   cat tmp
   ```

   You should see the same detailed directory listing as you would from `ls -l`. However, there may be small differences due to things like timestamps or file permissions.

### Step 2: Use `diff` to compare the current `ls -l` output with `tmp`

Now, you want to compare the contents of `tmp` with the current output of `ls -l`. We can use the `diff` command for this comparison.

1. **Run the `diff` command** to compare `tmp` with the current output of `ls -l`:

   ```bash
   diff tmp <(ls -l)
   ```

   Here's how this works:
   - `tmp` is the first file to compare.
   - `<(ls -l)` is process substitution. It runs `ls -l` and provides the output as a temporary file-like stream that `diff` can read, without needing to redirect it to a file.

   The `diff` command will show the differences between the content of `tmp` (the directory listing you saved earlier) and the current output of `ls -l`.

### Step 3: Redirect the `diff` output to `difflog`

To capture the output of `diff` into a file called `difflog`, we can redirect it as follows:

1. **Redirect `diff` output to `difflog`**:

   ```bash
   diff tmp <(ls -l) > difflog
   ```

   This saves the differences between `tmp` and the current `ls -l` output in the `difflog` file.

2. **Append new `diff` output to `difflog`** (in case you want to run the `diff` again later):

   ```bash
   diff tmp <(ls -l) >> difflog
   ```

   The `>>` operator appends the new differences to the `difflog` file, instead of overwriting it.

### Step 4: Inspect the `difflog` file

Finally, you can inspect the `difflog` file to see what the differences tell you about changes in the directory listing. For example:

```bash
cat difflog
```

This will show you all the differences that `diff` has detected. By running the same `diff` command multiple times (e.g., after making changes to the directory), you can track how the contents of the directory have changed.

### Summary of Commands:

1. Redirect `ls -l` output to `tmp`:
   ```bash
   ls -l > tmp
   ```

2. Compare `tmp` with the current `ls -l` output using `diff`:
   ```bash
   diff tmp <(ls -l)
   ```

3. Redirect the `diff` output to `difflog`:
   ```bash
   diff tmp <(ls -l) > difflog
   ```

4. Append new `diff` output to `difflog`:
   ```bash
   diff tmp <(ls -l) >> difflog
   ```

5. Inspect the contents of `difflog`:
   ```bash
   cat difflog
   ```

  ```
  3c3
  < -rw-r--r-- 1 vagrant vagrant     385 Sep 27 18:24 difflog
  ---
  > -rw-r--r-- 1 vagrant vagrant       0 Nov 29  2024 difflog
  6c6
  < -rw-r--r-- 1 vagrant vagrant       0 Nov 29  2024 tmp
  ---
  > -rw-r--r-- 1 vagrant vagrant     452 Nov 29 19:43 tmp
  1c1
  < total 2884
  ---
  > total 2888
  3c3
  < -rw-r--r-- 1 vagrant vagrant     385 Sep 27 18:24 difflog
  ---
  > -rw-r--r-- 1 vagrant vagrant     248 Nov 29 19:48 difflog
  6c6
  < -rw-r--r-- 1 vagrant vagrant       0 Nov 29  2024 tmp
  ---
  > -rw-r--r-- 1 vagrant vagrant     452 Nov 29 19:43 tmp
  ```
