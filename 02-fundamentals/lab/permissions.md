# File permissions

Log in to your Debian VM for the following exercises.

## Create a user and a group

Create a new user with `sudo adduser NAME` - I'm going to be using `brian` as an example name in these notes. When it asks for a password, you can just use `brian` or something; it will complain about the password being too short but it will create the user anyway. You can skip the GECOS information asking for a full name and phone number---it's just to help an admin contact you if needed.

Check the user and group files with `tail /etc/passwd` and `tail /etc/group` to check that the new user has been created - `tail` displays the last 10 lines of a file by default; `tail -n N FILE` would display the last N lines. Your new user `brian` (or whatever you called them) should appear in both files. Also check with `ls -l /home` that the home directory for Brian exists and is set to the correct user and group.

Time to change user: `su brian` and enter the password. Notice that the prompt has changed to `brian@debian12:/home/vagrant$` (at least if you started off in that folder). So the user has changed, and because `/home/vagrant` is no longer the current user's home directory, it gets written out in full. Run `cd` to go home followed by `pwd` and check that you are now in `/home/brian` or whatever you called your new user.

Next, create a user `nigel` (or some other name) add both your two new users, but not `vagrant`, to the group `users` (which already exists) using the command `sudo usermod -aG GROUPNAME USERNAME`, where group and username are changed accordingly. Note: `brian` cannot use sudo, so you have to exit his terminal to get back to one running as the user `vagrant` for this.

## Explore file permissions

As user `brian` (or whatever you called your first new user), set up your home directory using what you learnt in the videos so that

  * You can do everything (rwx).
  * Members of the `users` group can list files and change to your home directory, but not add/remove files. You will need to change the group of your home directory to `users` for this, using the command `chgrp -R GROUPNAME DIRECTORY`.
  * Everyone else cannot do anything with your home directory.

Create a file in your home directory, e.g. `nano readme.txt` then add some content.

Check, by using `su USERNAME` to log in as the different users, that:
  * `nigel` can view Brian's home directory but not create files there; 
  * `nigel` can view but not edit Brian's readme file; 
  * `vagrant` cannot list files in or enter Brian's home directory at all. What happens when you try?

_Of course, vagrant can use sudo to get around all these restrictions. Permissions do not protect you from anyone who can become root._

Also as `brian`, make a `private` subdirectory in your home folder that no-one but you can access (read, write or execute). Create a file `secret.txt` in there with `nano private/secret.txt` as user `brian` from Brian's home directory, and put something in it. Do not change any permissions on `secret.txt` itself.

Check as Nigel that you can see the folder itself, but not cd into it nor list the file. Check that even knowing the file name (`cat /home/brian/private/secret.txt`) as Nigel doesn't work.

Using `ls -l` as Brian in both `~` and `~/private`, compare the entries for the files `~/readme.txt`, `~/private/secret.txt` and the folder `~/private`. Why do the groups of the two files differ?

Note that, even though the secret file has read permissions for everyone by default, Nigel cannot read it. The rule is that you need permissions on the whole path from `/` to a file to be able to access it.

_This is another reminder that if you want to store private files on a lab machine, then put it in a folder that is only accessible to you. Other students can read your home directory by default, and they would be able to look at your work. This has led to plagiarism problems in the past, but good news: we keep logs and can usually figure out what happened! `:-)`._

_Altenatively you could remove permissions from everyone else on your home directory there, but this prevents you from being able to share files in specific folders that you do want to share with other students._


### 1. **Setting up file permissions on the home directory for `brian`**:

As user `brian`, follow these steps:

1. **Set full permissions for yourself** (`rwx`):

```bash
chmod 700 ~
```

This gives you (as `brian`) full read, write, and execute (`rwx`) permissions for your home directory, but prevents anyone else from doing anything.

2. **Allow members of the `users` group to list files and change into the home directory, but not add/remove files**:
   First, change the group of your home directory to `users`:

```bash
sudo chgrp -R users ~
```

Now, modify the permissions so members of the `users` group can read and execute (list and enter the directory) but cannot modify the files:

```bash
chmod 750 ~
```

This grants:
- `brian` (owner) full permissions (`rwx`).
- Members of the `users` group read and execute permissions (`r-x`), which allows them to list the directory and enter it.
- Others have no access to the directory (`---`).

3. **Prevent others from accessing your home directory**:
   By setting the permission as `750`, others (non-group members) will not be able to access your home directory.

### 2. **Create the `readme.txt` file**:

Now, as `brian`, create the `readme.txt` file in your home directory:

```bash
nano ~/readme.txt
```

Add some content to this file (e.g., "This is Brian's readme.") and save it. 

### 3. **Testing the permissions as different users**:

Now, you need to test the permissions as different users.

- **Log in as `nigel`** using `su` and check the permissions:

```bash
su nigel
cd /home/brian
```

- **Test that `nigel` can view `brian`'s home directory but cannot create files**:

```bash
ls
nano testfile.txt  # This should fail due to write restrictions
```

- **Test that `nigel` can view but not edit `readme.txt`**:

```bash
cat readme.txt  # This should succeed
nano readme.txt  # This should fail due to write restrictions
```

- **Log in as `vagrant`** and check if `vagrant` can list files in `brian`'s home directory:

```bash
su vagrant
cd /home/brian
ls  # This should fail as `vagrant` has no permissions
```

- **Test that `vagrant` cannot access `brian`'s home directory at all**:

If you try to `cd` or `ls` in `brian`'s home directory, it should fail because `vagrant` has no read/execute permissions in that directory.

   If `vagrant` uses `sudo`, they can bypass these restrictions and access the directory, since `sudo` gives root privileges.

### 4. **Create a private subdirectory**:

Now, create a private subdirectory inside `brian`'s home directory that only `brian` can access:

```bash
mkdir ~/private
chmod 700 ~/private  # Only brian can access it
```

Create a file `secret.txt` inside this private subdirectory:

```bash
nano ~/private/secret.txt
```

Add some content to the file (e.g., "This is a secret.") and save it.

### 5. **Test as `nigel` to verify the private directory**:

Switch to `nigel` and test the access to the `private` subdirectory:

```bash
su nigel
cd /home/brian/private  # This should fail due to lack of execute permission
ls  # This should fail since nigel has no permission to list files
cat /home/brian/private/secret.txt  # This should fail even though the file has read permissions
```

### 6. **Compare file permissions**:

Now, log in as `brian` and inspect the permissions of the files:

```bash
ls -l ~  # Check permissions for readme.txt
ls -l ~/private  # Check permissions for secret.txt and private folder
```

You should see the following:
- `~/readme.txt` will be in `brian`'s group (likely `brian`'s group) or `users`, depending on the group settings.
- `~/private` and `~/private/secret.txt` will be accessible only to `brian` because the permissions are set to `700`.

The group difference between `~/readme.txt` and `~/private/secret.txt` happens because:
- `~/readme.txt` is created in `brian`'s home directory, and `brian`'s primary group will be assigned by default.
- `~/private/secret.txt` inherits the permissions from the parent directory, which is specifically set to restrict access only to `brian`.

### 7. **Conclusion**:

- Even though `secret.txt` has read permissions for everyone, `nigel` cannot read it because they do not have permission to access the entire path (the `private` directory is restricted).
- The file permissions in the `private` directory ensure that `brian` is the only one who can read, write, or execute files inside it.

### Summary of Commands:

1. Set up home directory permissions for `brian`:

```bash
chmod 700 ~
sudo chgrp -R users ~
chmod 750 ~
```

2. Create the `readme.txt` file:

```bash
nano ~/readme.txt
```

3. Test the permissions as `nigel` and `vagrant`:

```bash
su nigel
cd /home/brian
ls
nano testfile.txt
cat readme.txt
su vagrant
cd /home/brian
ls
```

4. Create a private subdirectory:

```bash
mkdir ~/private
chmod 700 ~/private
nano ~/private/secret.txt
```

5. Test as `nigel`:

```bash
su nigel
cd /home/brian/private
cat /home/brian/private/secret.txt
```

6. Check file permissions:

```bash
ls -l ~
ls -l ~/private
```


## Setuid

We are going to create a file to let Nigel (and others in the users group) send Brian messages which go in a file in his home directory.

As Brian, create a file `message-brian.c` in your home directory and add the following lines:

```C
#include <stdio.h>
#include <stdlib.h>

const char *filename ="/home/brian/messages.txt";

int main(int argc, char **argv) {
  if (argc != 2) {
    puts("Usage: message-brian MESSAGE");
    return 1;
  }
  FILE *file = fopen(filename, "a");
  if (file == NULL) {
    puts("Error opening file");
    return 2;
  }
  int r = fputs(argv[1], file);
  if (r == EOF) {
    puts("Error writing message");
    return 2;
  }
  r = fputc('\n', file);
  if (r == EOF) {
    puts("Error writing newline");
    return 2;
  }
  fclose(file);
  return 0;
}
```

Compile it with `gcc -Wall message-brian.c -o message-brian` (you should not get any warnings) and check with `ls -l`, you will see a line like

    -rwxr-xr-x    1 brian     brian         19984 Oct 28 13:26 message-brian

These are the default permissions for a newly created executable file; note that gcc has set the three `+x` bits for you. Still as Brian, run `chmod u+s message-brian` and check the file again: you should now see `-rwsr-xr-x` for the file permissions. The `s` is the setuid bit.

As Nigel (`su nigel`), go into Brian's home directory and run `./message-brian "Hi from Nigel!"`. The quotes are needed here because the program accepts only a single argument.

Now run `ls -l` and notice that a `messages.txt` has appeared with owner and group `brian`. Check the contents with `cat messages.txt`. Although Nigel cannot create and edit files in Brian's home directory himself (he can't edit `messages.txt` for example, although he can read it), the program `message-brian` ran as Brian, which let it create the file. Nigel can send another message like this (`./message-brian "Hi again!"`), which gets appended to the file: try this out.

This shows how setuid programs can be used to allow other users to selectively perform specific tasks under a different user account.

**Warning**: writing your own setuid programs is extremely dangerous if you don't know the basics of secure coding and hacking C programs, because a bug in such a program could let someone take over your user account. The absolute minimum you should know is the contents of our security units up to and including 4th year.

A general task for a security analyst might be finding all files with the setuid bit set on a system. You can try this yourself, but return to a vagrant shell first so that you're allowed to use sudo:

    sudo find / -perm /4000

You might get some errors relating to `/proc` files, which you can ignore: these are subprocesses that find uses to look at individual files.

Apart from `message-brian`, you'll find a few files by default: `sudo`, `mount`, `umount` and `su`. The first one you already know; look up what the next two do and think about why they are setuid. Specifically, what kinds of (un)mounting are non-root users allowed to do according to the manual pages?

Look up the `passwd` program in the manual pages.  Why might that program need to be setuid?

### 1. **Creating the `message-brian.c` File:**

As `brian`, create the `message-brian.c` file in your home directory:

```bash
nano ~/message-brian.c
```

Add the following C code to the file:

```c
#include <stdio.h>
#include <stdlib.h>

const char *filename ="/home/brian/messages.txt";

int main(int argc, char **argv) {
  if (argc != 2) {
    puts("Usage: message-brian MESSAGE");
    return 1;
  }
  FILE *file = fopen(filename, "a");
  if (file == NULL) {
    puts("Error opening file");
    return 2;
  }
  int r = fputs(argv[1], file);
  if (r == EOF) {
    puts("Error writing message");
    return 2;
  }
  r = fputc('\n', file);
  if (r == EOF) {
    puts("Error writing newline");
    return 2;
  }
  fclose(file);
  return 0;
}
```

This program allows a user to append a message to `brian`'s `messages.txt` file in his home directory.

### 2. **Compiling the Program:**

Compile the C program using `gcc`:

```bash
gcc -Wall ~/message-brian.c -o ~/message-brian
```

After compiling, check the file permissions:

```bash
ls -l ~/message-brian
```

You should see the following output (permissions for an executable file):

```
-rwxr-xr-x 1 brian brian 19984 Oct 28 13:26 message-brian
```

These are the default permissions for a newly created executable file.

### 3. **Setting the Setuid Bit:**

Now, set the `setuid` bit for the `message-brian` program, which allows it to run with the permissions of the file's owner (`brian`), not the user who runs it (e.g., `nigel`):

```bash
chmod u+s ~/message-brian
```

Check the file permissions again:

```bash
ls -l ~/message-brian
```

The file permissions should now include the `s` in place of the `x` for the user:

```
-rwsr-xr-x 1 brian brian 19984 Oct 28 13:26 message-brian
```

The `s` in the user execute position indicates that the `setuid` bit is set.

### 4. **Running the Program as `nigel`:**

Switch to the `nigel` user using `su`:

```bash
su nigel
```

Now, run the `message-brian` program in `brian`'s home directory to append a message:

```bash
cd /home/brian
./message-brian "Hi from Nigel!"
```

The program should execute successfully, even though `nigel` doesn't have permission to write to `brian`'s home directory. It appends the message to `messages.txt`.

### 5. **Checking the `messages.txt` File:**

Check the contents of the `messages.txt` file:

```bash
cat /home/brian/messages.txt
```

The file should contain the message from `nigel`:

```
Hi from Nigel!
```

You can run the program again to append another message:

```bash
./message-brian "Hi again!"
```

After running this command, check the `messages.txt` file again:

```bash
cat /home/brian/messages.txt
```

You should see:

```
Hi from Nigel!
Hi again!
```

### 6. **Understanding the Setuid Mechanism:**

The `setuid` bit allows the `message-brian` program to run with the privileges of the file owner (`brian`), regardless of the user running the program. This is why `nigel` (who normally doesn't have permission to write to `brian`'s home directory) can still append to `messages.txt` using `message-brian`.

### 7. **Security Risks of Setuid Programs:**

**Warning:** Writing your own `setuid` programs is risky because bugs in such programs can introduce security vulnerabilities, potentially allowing users to escalate their privileges. Specifically, if a `setuid` program is vulnerable to exploits like buffer overflows, users might be able to overwrite memory and execute arbitrary code with elevated privileges.

In the case of the `message-brian` program, any bugs could allow an attacker to exploit it to run arbitrary commands as `brian`. This is why it's crucial to write `setuid` programs with great care and knowledge of secure coding practices.

### 8. **Finding Files with the Setuid Bit Set:**

To find all files with the `setuid` bit set on the system, run the following command as `vagrant` (using `sudo`):

```bash
sudo find / -perm /4000
```

This will list all files with the `setuid` bit set. You may see files like `sudo`, `mount`, `umount`, and `su`.

### 9. **Understanding Setuid Files:**

- **`sudo`**: This allows users to run commands with the privileges of another user (typically root). It must be `setuid` because users need to execute it with elevated privileges to run commands as root.
  
- **`mount` and `umount`**: These programs allow mounting and unmounting of file systems. They need to be `setuid` because users often need to mount/unmount file systems that require root privileges (e.g., mounting external drives).
  
- **`su`**: This program allows users to switch user identities. It's typically `setuid` so that users can switch to the root account (or another account) using `su`, which requires root privileges.

### 10. **The `passwd` Program and Setuid:**

The `passwd` program is used to change a user's password. It needs to be `setuid` because only the root user can update the password file (`/etc/passwd`) and set the password for a user. If it wasn't `setuid`, users wouldn't be able to change their own passwords, as the file is usually owned by root and requires root privileges to modify.

### Summary:

- The `setuid` bit allows a program to run with the privileges of the file's owner, not the user executing the program.
- You can use `setuid` programs to allow users to perform specific tasks that require elevated privileges, without giving them full access to root.
- `setuid` programs should be written with caution to avoid security vulnerabilities that could be exploited to escalate privileges.
- Common `setuid` programs include `sudo`, `mount`, `umount`, `su`, and `passwd`.


## Sudo

Make sure your terminal is running as `brian` and try a `sudo ls`. You will see a general message, you will be asked for your password, and then you will get the error `brian is not in the sudoers file.  This incident will be reported.` (This means that an entry has been logged in `/var/log/messages`.)

So, `brian` can currently not use sudo. Switch back to `vagrant` and run the command `sudo cat /etc/sudoers`. Everything is commented out except `root ALL=(ALL) ALL` and the last line `#includedir /etc/sudoers.d` (this is not a comment!) which contains a single file `vagrant` with the line `vagrant ALL=(ALL) NOPASSWD: ALL` which is why vagrant can use sudo in the first place.

However, note the commented lines such as

    # %wheel ALL=(ALL) NOPASSWD: ALL
    # %sudo ALL=(ALL) ALL

If uncommented, the first one would let everyone in group wheel run commands using sudo (this is the default on some other Linux distributions), whereas the second one would allow everyone in the group `sudo` to do this, but would prompt for their own password beforehand.

Let's allow people in the users group to reboot the machine. Open a root shell with `sudo su` as user `vagrant`; this is so we don't get locked out if we break sudo.

Edit the sudoers file with `visudo` as root, and add the following line:

    %users ALL=(ALL) /sbin/reboot

and save the sudoers file.

**Warning:**: Never edit `/etc/sudoers` directly and *always* use `visudo` instead.  If you make a mistake and add a syntax error to the file then `sudo` will refuse to work.  If your root account doesn't have a password (some people don't like that as a security precaution) then you'll have to spend the next half-hour figuring out how to break into your own computer and wrestle back control.  There is almost always a command to check a config file before replacing the current one: the same advice also applies to the ssh config files.  If you break them you might have to travel to wherever the server is with a keyboard and a monitor.

You can now switch back to `brian` (check the prompt to make sure you are Brian) and do `sudo reboot`. After asking for Brian's password, the virtual machine will now reboot, which you notice because you get kicked out of your ssh connection. Another `vagrant ssh` after a few seconds will get you back in again.

(Note: After rebooting, your `/shared` shared folder might not work. In this case, log out and do `vagrant halt` then `vagrant up` and `vagrant ssh` again on the host machine. When vagrant boots your VM, it automatically sets up the shared folder, but this doesn't always work if you reboot the VM yourself.)


The steps outlined involve configuring `sudo` permissions for the user `brian` and allowing members of the `users` group to execute specific commands, like rebooting the machine. Here's a detailed explanation of the steps involved and how to carry them out:

### 1. **Check sudo permissions for `brian`**
- When logged in as `brian`, if you try to run a command like `sudo ls`, you will see an error:
  ```
  brian is not in the sudoers file. This incident will be reported.
  ```
  This means `brian` is not currently allowed to use `sudo` and the attempt will be logged.

### 2. **Switch to `vagrant` and view the sudoers file**
- To modify the sudoers file and allow `brian` to use `sudo`, you need to switch to a user who already has `sudo` permissions. In this case, it's `vagrant`.
  
  Run the following command as `vagrant`:
  ```bash
  sudo cat /etc/sudoers
  ```
  The content will likely look like this:
  ```
  root ALL=(ALL) ALL
  # %wheel ALL=(ALL) NOPASSWD: ALL
  # %sudo ALL=(ALL) ALL
  #includedir /etc/sudoers.d
  ```

### 3. **Edit the sudoers file using `visudo`**
- Since you don’t want to edit the sudoers file directly to avoid syntax errors, you should use the `visudo` command, which performs syntax checking.

  Run the following command as `vagrant` to edit the sudoers file:
  ```bash
  sudo visudo
  ```

- Inside the file, add the following line to allow all members of the `users` group to execute the `reboot` command:
  ```bash
  %users ALL=(ALL) /sbin/reboot
  ```

- Save and exit the editor (usually pressing `Ctrl+X`, then confirming with `Y` and `Enter`).

### 4. **Test sudo access for `brian`**
- Switch back to `brian`:
  ```bash
  su brian
  ```
- Now, try running the following command to reboot the machine:
  ```bash
  sudo reboot
  ```
- You will be prompted for `brian`'s password. After entering it, the system should reboot.

### 5. **Troubleshooting shared folders**
- After rebooting, if you notice that the shared folder (`/shared`) isn't working, this is a common issue when using VirtualBox with `vagrant` shared folders.
  
  To fix this, perform the following:
  ```bash
  vagrant halt  # Shut down the virtual machine
  vagrant up    # Start the virtual machine again
  vagrant ssh   # SSH into the VM again
  ```
  This should re-establish the shared folder setup automatically.

### Notes:
- **Never edit `/etc/sudoers` directly**: Always use `visudo` to edit the sudoers file, as it checks for syntax errors before applying the changes. A mistake could lock you out of `sudo` access.
- **sudo permissions**: By adding `%users ALL=(ALL) /sbin/reboot` to the sudoers file, you grant all members of the `users` group the ability to execute the `reboot` command with `sudo` without additional checks.
  
This setup provides a controlled way of giving certain users elevated privileges for specific commands without granting full root access.
