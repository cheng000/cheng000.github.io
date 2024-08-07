# CTF竞赛权威指南（Pwn篇）

## 01 简介
> 本书专注于Linux二进制安全。全书包含12章，从二进制底层开始，结合源码详细分析了常见的二进制安全漏洞、缓解机制以及漏洞利用方法，并辅以分析工具和环境搭建的讲解。本书在素材的选择上较为连续、完整，每个知识点均配以经典例题，并花费了大量篇幅深入讲解，以最大程度地还原分析思路和解题过程。读者完全可以依据本书自主、系统性地学习，达到举一反三的效果。本书主要面向CTF初学者，也适合对CTF感兴趣的人群学习。

## 02 AI速读
> 《CTF竞赛权威指南》是一本专注于Linux二进制安全的书籍。全书包含12章，从二进制底层开始，结合源码详细分析了常见的二进制安全漏洞、缓解机制以及漏洞利用方法，并辅以分析工具和环境搭建的讲解。本书在素材的选择上较为连续、完整，每个知识点均配以经典例题，并花费了大量篇幅深入讲解，以最大程度地还原分析思路和解题过程。读者完全可以依据本书自主、系统性地学习，达到举一反三的效果。本书主要面向CTF初学者，也适合对CTF感兴趣的人群学习。

> 书中首先介绍了CTF竞赛平台与资源，包括赛事介绍、赛事形式、竞赛模式以及竞赛内容等。随后，本书深入讲解了编译原理，包括词法分析、语法分析、语义分析、中间代码生成和优化、代码生成和优化等。接着，本书介绍了ELF文件结构概览，包括ELF文件的组成和结构，以及如何使用Pwntools库来操作ELF文件。

> 此外，本书还详细介绍了静态链接和动态链接的过程和优势，包括符号解析和重定位等。同时，本书也讲解了CPU架构与指令集，包括CISC与RISC指令集架构，以及x86与ARM指令集架构等。

> 在介绍漏洞利用方法时，本书深入讲解了栈溢出原理，包括函数调用栈、栈溢出的利用方式等。同时，本书也介绍了one-gadget技术原理与应用，包括one-gadget的概念、寻找方法以及应用场景等。此外，本书还讲解了利用vsyscall进行漏洞利用，包括vsyscall的概念、利用方法以及应用场景等。