# Shell Script

Shell script 是一種用來自動化執行指令和管理系統的程式語言。它通常在類 Unix 系統中使用（例如 Linux 和 macOS）。Shell script 基本上是由一系列 Shell 指令組成，並且可以包含條件語句、循環、函數等控制結構。下面我會介紹一些基本的 Shell script 語法。

### 1. **Shebang (`#!`)**
每個 shell script 文件的第一行通常會包含 `shebang`（`#!`），這告訴操作系統用哪個解釋器來執行腳本。例如：

```sh
#!/bin/bash
```

這意味著這個腳本會使用 `bash` 解釋器來執行。

### 2. **註解**
Shell script 中的註解以 `#` 開頭。該行之後的內容將被忽略，直到行尾。例如：

```sh
# 這是一個註解
echo "Hello, world!"  # 這也是註解
```

### 3. **變量**
Shell script 支援變量，用來儲存資料。變量名稱通常由字母、數字和底線組成，但不能以數字開頭。設置變量時，等號兩邊不能有空格：

```sh
name="Alice"
age=30
```

要使用變量時，可以使用 `$` 符號來引用：

```sh
echo "Name: $name, Age: $age"
```

### 4. **條件語句 (`if`, `else`, `elif`)**
Shell script 支援條件判斷，用來根據不同的條件執行不同的指令。例如：

```sh
if [ $age -gt 18 ]; then
    echo "Adult"
else
    echo "Not an adult"
fi
```

- `-gt` 是比較操作符，表示 "greater than"（大於）。
- `if` 判斷條件是否成立，如果成立，執行 `then` 之後的語句，否則執行 `else` 部分。

你也可以使用 `elif` 來檢查其他條件：

```sh
if [ $age -gt 18 ]; then
    echo "Adult"
elif [ $age -eq 18 ]; then
    echo "Just turned 18"
else
    echo "Not an adult"
fi
```

### 5. **循環語句 (`for`, `while`)**
Shell script 支援循環結構，用來重複執行一組指令。

- **`for` 循環**：用來遍歷一個列表或範圍的值。

```sh
for i in 1 2 3 4 5; do
    echo "Number: $i"
done
```

- **`while` 循環**：當條件成立時，重複執行一組指令。

```sh
count=1
while [ $count -le 5 ]; do
    echo "Count: $count"
    ((count++))  # count 增加 1
done
```

### 6. **函數**
Shell script 支援定義函數，可以將常用的操作封裝成函數來重複使用。

```sh
greet() {
    echo "Hello, $1!"  # $1 是函數的第一個參數
}

greet "Alice"  # 調用函數，傳遞參數
```

### 7. **命令列參數**
Shell script 可以接收命令列參數，這些參數在腳本執行時傳遞給腳本。

- `$1` 到 `$9`：表示第一個到第九個命令列參數。
- `$#`：表示傳遞給腳本的參數個數。
- `$@` 或 `$*`：表示所有的命令列參數。
- `$0`：表示腳本本身的名稱。

```sh
echo "The first argument is: $1"
echo "Total arguments: $#"
```

### 8. **退出腳本 (`exit`)**
`exit` 用來退出腳本，並可以指定一個退出狀態（默認是 `0`，表示成功）。非零值通常表示錯誤或異常情況。

```sh
echo "Exiting script..."
exit 1  # 退出並返回狀態碼 1，通常表示錯誤
```

### 9. **檔案處理**
你可以在 Shell script 中讀取和寫入檔案。例如，使用 `cat`、`echo` 和重定向來處理檔案。

```sh
# 讀取檔案
cat file.txt

# 將內容寫入檔案
echo "Hello, World!" > output.txt

# 附加內容到檔案
echo "Appended text" >> output.txt
```

### 10. **錯誤處理**
在 shell script 中，你可以使用 `set -e` 來讓腳本在出現錯誤時停止執行。

```sh
set -e  # 一旦有錯誤發生，腳本就會終止執行
```

你也可以檢查命令的返回值來處理錯誤：

```sh
command_that_may_fail
if [ $? -ne 0 ]; then
    echo "Error occurred!"
    exit 1
fi
```

### 範例腳本
這是一個簡單的 shell script 範例，這個腳本根據傳遞的參數執行不同的操作。

```sh
#!/bin/bash

# 檢查是否有傳遞命令列參數
if [ $# -eq 0 ]; then
    echo "No arguments provided."
    exit 1
fi

# 取得命令列參數
COMMAND=$1

if [ "$COMMAND" == "greet" ]; then
    echo "Hello, $2!"
elif [ "$COMMAND" == "goodbye" ]; then
    echo "Goodbye, $2!"
else
    echo "Unknown command: $COMMAND"
    exit 1
fi
```

### 執行這個腳本
1. 儲存這段腳本為 `example.sh`。
2. 給予執行權限：

```sh
chmod +x example.sh
```

3. 執行腳本：

```sh
./example.sh greet Alice
```

這會輸出：
```
Hello, Alice!
```

### 小結
Shell scripting 是一種強大且靈活的工具，可以幫助你自動化許多操作。基本語法包括變量、條件語句、循環、函數和檔案處理等，這些是編寫有效的 shell script 所需的基本構建塊。

`if [ $? -ne 0 ]; then` 是用來檢查上一個命令或程序的退出狀態（exit status）是否不等於 0。這是檢查命令是否執行成功的常見方式，讓我來詳細解釋：

### `$?` 代表什麼？
- `$?` 是一個特殊變數，它存儲的是上一個執行的命令的退出狀態碼（exit status）。  
  - 退出狀態 `0` 通常表示命令執行成功。
  - 非零的退出狀態（如 `1`、`2` 等）表示命令執行失敗，具體的錯誤碼依照命令的不同而不同。

### `-ne` 代表什麼？
- `-ne` 是一個比較運算符，代表 **"not equal"**，即“不等於”。
  - 所以，`$? -ne 0` 表示檢查上一個命令的退出狀態是否不等於 0，即檢查上一個命令是否失敗。

### 具體例子：
假設你執行以下腳本片段：

```sh
gcc hello.c -o hello
if [ $? -ne 0 ]; then
    echo "Compilation failed!"
    exit 1
fi
```

1. **`gcc hello.c -o hello`**：嘗試編譯 `hello.c` 文件。
   - 如果編譯成功，`gcc` 命令會以退出狀態 `0` 結束。
   - 如果編譯失敗，`gcc` 會返回非零退出狀態（例如 `1`），表示發生錯誤。

2. **`if [ $? -ne 0 ]; then`**：
   - ` $?` 會捕捉到 `gcc` 命令的退出狀態。
   - 如果 `gcc` 命令的退出狀態不等於 `0`（即編譯失敗），條件 `[ $? -ne 0 ]` 會返回 `true`，並執行 `then` 部分的命令。

3. **執行結果**：
   - 如果編譯失敗，腳本會顯示 `Compilation failed!`，並且退出腳本，返回錯誤狀態 `1`。
   - 如果編譯成功，則 `if` 條件不會成立，腳本繼續執行。

### 小結：
- `if [ $? -ne 0 ]; then` 用來檢查上一個命令的退出狀態碼是否不等於 `0`，也就是檢查命令是否失敗。
- 當上一個命令失敗時，可以使用這個語句來處理錯誤或停止腳本執行。
