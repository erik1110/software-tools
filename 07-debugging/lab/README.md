# Debugging (and Crackmes)

For this lab we're going to solve some crackmes!  Crackmes are little
reverse engineering puzzles where you have to figure out a password
for a program without being able to look directly at code that is
being run.

Each program runs directly on a commandline and will prompt you for a
password.  Your task is to figure out what that password is.  The
programs are written using POSIX C (so should compile and run
absolutely anywhere).

## To begin

To begin download the source code and run `make` to build the
crackmes.

<https://github.com/uob-jh/crackmes>

You'll end up with five little crackme programs to run.

**Note**: You also have the source code for all the crackmes... but
reading it defeats the objective somewhat.  If you *really* can't do
one take a peek, there are ROT13'd hints inside and if you *really,
really* can't do one there are steps towards the passwords in the
solutions.  There is also a testing script called `cheater.sh` that
contains solutions (but with no explanations).
  
## Suggestions

We recommend the following tools (all of which are installed on the
lab machines):

- `gdb`: general purpose debugging tool.  Can step through a program
  and stop where you like to inspect things. [The documentation is
  available
  online.](https://sourceware.org/gdb/current/onlinedocs/gdb)  It
  is intimidating to use at first, but with practice it'll get easier:
  it is *the standard* debugger for a reason and it is crazilly
  powerful.
- `strace`: check what system calls a program makes.
- `ltrace`: check what library calls a program makes.
- `strings`: look for strings of printable characters in an arbitrary
  binary blob.
- `objdump`: extract the compiled instructions from a binary.

## Tutorial
```
$ git clone https://github.com/uob-jh/crackmes
Cloning into 'crackmes'...
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 10 (delta 2), reused 10 (delta 2), pack-reused 0
Receiving objects: 100% (10/10), done.
Resolving deltas: 100% (2/2), done.
$ cd crackmes/
$ make
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-1.c   -o crackme-1
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-2.c   -o crackme-2
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-3.c   -o crackme-3
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-4.c   -o crackme-4
cc -g -Og -Wall -Wextra -pedantic --std=c11    crackme-5.c   -o crackme-5
$ ./crackme-1
What is the password?
password
Nope
```

Hmm... the password isn't `password`... what else could it be?  Lets
try the `strings` tool to see if we can find it…

```
$ strings -d ./crackme-1
/lib64/ld-linux-x86-64.so.2
libc.so.6
puts
stdin
getline
__libc_start_main
free
GLIBC_2.2.5
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
[]A\A]A^A_
What is the password?
Beetlejuice
You win!
Nope
;*3$"
```

Anything in there look suspicious?  What about that `;*3$` on the last
line?  Lets try that.

```
$ ./crackme-1 <<<';*3$'
What is the password?
Nope
```

Still not right.  Can we use `ltrace` to get some more hints?

```
$ ltrace ./crackme-1 <<<';*3$'
puts("What is the password?"What is the password?
)                                                  = 22
getline(0x7ffe283e27b0, 0x7ffe283e27a8, 0x7f74213889c0, 0x7ffe283e27a8)        = 5
strcmp(";*3$", "Beetlejuice")                                                  = -7
puts("Nope"Nope
)                                                                   = 5
free(0x207c6b0)                                                                = <void>
+++ exited (status 1) +++
```

If you're still not sure what the password is you'll have to view the
source code:

```
$ gdb ./crackme-1
Reading symbols from ./crackme-1...done.
(gdb) b main
Breakpoint 1 at 0x4006ae: file crackme-1.c, line 7.
(gdb) run <<<';*3$'
Starting program: /home/jh18636/crackmes/crackme-1 <<<';*3$'

Breakpoint 1, main () at crackme-1.c:7
7	 char *input = NULL;
(gdb) disas
Dump of assembler code for function main:
   0x00000000004006a6 <+0>:	push   %rbp
   0x00000000004006a7 <+1>:	mov    %rsp,%rbp
   0x00000000004006aa <+4>:	sub    $0x30,%rsp
=> 0x00000000004006ae <+8>:	movq   $0x0,-0x20(%rbp)
   0x00000000004006b6 <+16>:	movq   $0x0,-0x28(%rbp)
   0x00000000004006be <+24>:	movq   $0x0,-0x10(%rbp)
   ```
   
Step (`si`) it through and use the print commands to look at what is
happening (`i r` for registers `p` for expressions).
  
## Hints

- `crackme-1`: this is easy... read the output of `ltrace`!
- `crackme-2`: a bit harder! I've taken steps to ensure you can't use
  `strings` or `ltrace` like `crackme-1`... you should be able to work
  it out from the disassembly though…
- `crackme-3`: if you use `ltrace` the password you provide doesn't
  look like its getting tested against the real password? What is
  happening?
- `crackme-4`: if you use `ltrace` you'll see this one is
  random... have I used the random number generator correctly though?
  Why does it have extra weird code for OpenBSD?  How do random
  numbers work there?
- `crackme-5`: this is hard! There are infinitely many valid solutions
  though... What's the shortest one you can find? What happens if you
  type `.` as part of your password?

## If you want to do this on your own machine…

This should work anywhere... if you want to do it on your own computer
have at it! There are plenty of other debugging tools out there and they're all
useful to varying degrees. 

Just bare in mind two things:
- That it's fair for us to ask questions on the ones on the lab machines (the above list) in any exam you may sit `;-)`
- That the TAs don't know how your computer works.  They've all used
  GDB before though…

If you use a Mac or run BSD the standard debugger is `lldb` instead of
`gdb`.  It is *very* similar, but does things differently.  You also
have `dtrace` which can do a lot of what `strace` does (and a bit
more).

If you run Windows... Visual Studio has a nice debugger, but it'll
show you the code unless your careful! [x64dbg looks like a nice
tool.](https://x64dbg.com)

## crackme-1
### Solution 1
```
gdb ./crackme-1
(gdb) b main
Breakpoint 1 at 0x4006ae: file crackme-1.c, line 7.
(gdb) run 
Starting program: /home/fp24955/Desktop/crackmes/crackme-1 

Breakpoint 1, main () at crackme-1.c:7
7	  char *input = NULL;
Missing separate debuginfos, use: yum debuginfo-install glibc-2.28-251.el8_10.5.x86_64
(gdb) disas
Dump of assembler code for function main:
   0x00000000004006a6 <+0>:	push   %rbp
   0x00000000004006a7 <+1>:	mov    %rsp,%rbp
   0x00000000004006aa <+4>:	sub    $0x30,%rsp
=> 0x00000000004006ae <+8>:	movq   $0x0,-0x20(%rbp)
   0x00000000004006b6 <+16>:	movq   $0x0,-0x28(%rbp)
   0x00000000004006be <+24>:	movq   $0x0,-0x10(%rbp)
   0x00000000004006c6 <+32>:	movq   $0x4007f8,-0x18(%rbp)
   0x00000000004006ce <+40>:	mov    $0x400804,%edi
   0x00000000004006d3 <+45>:	callq  0x400590 <puts@plt>
   0x00000000004006d8 <+50>:	mov    0x200961(%rip),%rdx        # 0x601040 <stdin@@GLIBC_2.2.5>
   0x00000000004006df <+57>:	lea    -0x28(%rbp),%rcx
   0x00000000004006e3 <+61>:	lea    -0x20(%rbp),%rax
   0x00000000004006e7 <+65>:	mov    %rcx,%rsi
   0x00000000004006ea <+68>:	mov    %rax,%rdi
   0x00000000004006ed <+71>:	callq  0x4005b0 <getline@plt>
   0x00000000004006f2 <+76>:	mov    %rax,-0x10(%rbp)
   0x00000000004006f6 <+80>:	mov    -0x20(%rbp),%rax
   0x00000000004006fa <+84>:	mov    -0x10(%rbp),%rdx
   0x00000000004006fe <+88>:	sub    $0x1,%rdx
   0x0000000000400702 <+92>:	add    %rdx,%rax
   0x0000000000400705 <+95>:	movb   $0x0,(%rax)
   0x0000000000400708 <+98>:	mov    -0x20(%rbp),%rax
   0x000000000040070c <+102>:	mov    -0x18(%rbp),%rdx
   0x0000000000400710 <+106>:	mov    %rdx,%rsi
   0x0000000000400713 <+109>:	mov    %rax,%rdi
   0x0000000000400716 <+112>:	callq  0x4005a0 <strcmp@plt>
   0x000000000040071b <+117>:	test   %eax,%eax
   0x000000000040071d <+119>:	jne    0x400732 <main+140>
   0x000000000040071f <+121>:	mov    $0x40081a,%edi
   0x0000000000400724 <+126>:	callq  0x400590 <puts@plt>
   0x0000000000400729 <+131>:	movl   $0x0,-0x4(%rbp)
   0x0000000000400730 <+138>:	jmp    0x400743 <main+157>
   0x0000000000400732 <+140>:	mov    $0x400823,%edi
   0x0000000000400737 <+145>:	callq  0x400590 <puts@plt>
   0x000000000040073c <+150>:	movl   $0x1,-0x4(%rbp)
   0x0000000000400743 <+157>:	mov    -0x20(%rbp),%rax
   0x0000000000400747 <+161>:	test   %rax,%rax
   0x000000000040074a <+164>:	je     0x400758 <main+178>
   0x000000000040074c <+166>:	mov    -0x20(%rbp),%rax
   0x0000000000400750 <+170>:	mov    %rax,%rdi
   0x0000000000400753 <+173>:	callq  0x400580 <free@plt>
   0x0000000000400758 <+178>:	mov    -0x4(%rbp),%eax
   0x000000000040075b <+181>:	leaveq 
   0x000000000040075c <+182>:	retq   
End of assembler dump.


(gdb) b *0x0000000000400716
Breakpoint 2 at 0x400716: file crackme-1.c, line 19.
(gdb) c
Continuing.
What is the password?
apple

Breakpoint 2, 0x0000000000400716 in main () at crackme-1.c:19
19	  if (strcmp(input, string) == 0) {
(gdb) disas
Dump of assembler code for function main:
   0x00000000004006a6 <+0>:	push   %rbp
   0x00000000004006a7 <+1>:	mov    %rsp,%rbp
   0x00000000004006aa <+4>:	sub    $0x30,%rsp
   0x00000000004006ae <+8>:	movq   $0x0,-0x20(%rbp)
   0x00000000004006b6 <+16>:	movq   $0x0,-0x28(%rbp)
   0x00000000004006be <+24>:	movq   $0x0,-0x10(%rbp)
   0x00000000004006c6 <+32>:	movq   $0x4007f8,-0x18(%rbp)
   0x00000000004006ce <+40>:	mov    $0x400804,%edi
   0x00000000004006d3 <+45>:	callq  0x400590 <puts@plt>
   0x00000000004006d8 <+50>:	mov    0x200961(%rip),%rdx        # 0x601040 <stdin@@GLIBC_2.2.5>
   0x00000000004006df <+57>:	lea    -0x28(%rbp),%rcx
   0x00000000004006e3 <+61>:	lea    -0x20(%rbp),%rax
   0x00000000004006e7 <+65>:	mov    %rcx,%rsi
   0x00000000004006ea <+68>:	mov    %rax,%rdi
   0x00000000004006ed <+71>:	callq  0x4005b0 <getline@plt>
   0x00000000004006f2 <+76>:	mov    %rax,-0x10(%rbp)
   0x00000000004006f6 <+80>:	mov    -0x20(%rbp),%rax
   0x00000000004006fa <+84>:	mov    -0x10(%rbp),%rdx
   0x00000000004006fe <+88>:	sub    $0x1,%rdx
   0x0000000000400702 <+92>:	add    %rdx,%rax
   0x0000000000400705 <+95>:	movb   $0x0,(%rax)
   0x0000000000400708 <+98>:	mov    -0x20(%rbp),%rax
   0x000000000040070c <+102>:	mov    -0x18(%rbp),%rdx
   0x0000000000400710 <+106>:	mov    %rdx,%rsi
   0x0000000000400713 <+109>:	mov    %rax,%rdi
=> 0x0000000000400716 <+112>:	callq  0x4005a0 <strcmp@plt>

0x00000000004006c6 <+32>:	movq   $0x4007f8,-0x18(%rbp)
這行指令在程式初始化階段出現，將一個固定值（0x4007f8）存放到變數（-0x18(%rbp)）中。這表明這個地址（0x4007f8）很可能是用來比較密碼的靜態字符串。

與 strcmp 的使用有關： 後面程式執行到這一行：

0x0000000000400716 <+112>:	callq  0x4005a0 <strcmp@plt>
strcmp 是用來比較兩個字串的函式。在呼叫 strcmp 之前，程式將兩個指標分別放到 rdi 和 rsi 寄存器中：
0x0000000000400710 <+106>:	mov    %rdx,%rsi  # 把正確的密碼地址存入 %rsi
0x0000000000400713 <+109>:	mov    %rax,%rdi  # 把使用者輸入地址存入 %rdi
而 rsi 的值（%rdx）最初來自 -0x18(%rbp)，所以 -0x18(%rbp) 必然存放正確密碼的地址。
0x4007f8 是個可能的靜態字串地址： 常見的 C 語言程式中，字符串常量通常以靜態方式存放於可執行檔案中（例如 .rodata 段）。地址 0x4007f8 很可能是這樣一個字串的地址。

```
Explanation of the Key Instructions:
At line <+32>: 
```
movq $0x4007f8,-0x18(%rbp)
```
This instruction stores the address 0x4007f8 into the local variable located at -0x18(%rbp). In simple terms, it assigns the address 0x4007f8 to a local variable (we’ll call this target_string). So, we know that the target password string is located at this address, 0x4007f8.

At line <+106>:
```
mov    -0x18(%rbp),%rdx
```
Here, the program loads the value stored at -0x18(%rbp) (which is 0x4007f8, the address of the target string) into register %rdx.

At line <+110>:
```
mov    %rdx,%rsi
```
This instruction moves the address of the target string (which is now in %rdx) into %rsi. In the x86-64 calling convention, the second argument to the strcmp function is passed in %rsi. So, at this point, the target string is ready to be passed as the second argument to strcmp.

At line <+109>:
```
mov    -0x20(%rbp),%rax
```
This instruction loads the address of the user input (stored at -0x20(%rbp)) into %rax.

At line <+112>:
```
    callq  0x4005a0 <strcmp@plt>
```
    This is where the program calls strcmp to compare the user input (in %rdi, which holds the address of the input string) with the target string (in %rsi, which holds the address 0x4007f8).

Conclusion:

    The address 0x4007f8 is the location of the target string (the password), which is being compared to the user's input using strcmp.
    You can retrieve the password by inspecting the string stored at 0x4007f8.

To see the password in GDB, run the following command:
```
x/s 0x4007f8
```
This will print the string stored at 0x4007f8, which is the password that the program is expecting.

