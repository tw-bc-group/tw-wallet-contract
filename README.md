# TW wallet Contract
TW Points 对应的erc20的智能合约

## Tool
quorum cli 是方便在 quorum 上的进行转账方式。
eth-cli 是以太坊命令行工具，也可以用于在 quorum 节点上，完成查看合约地址，调用合约方法。

### 部署方法
1. 安装依赖：`npm install`
2. 编译智能合约：`truffle compile`
3. 部署智能合约：`truffle migrate --network devNode1`
> 其中 `devNode1` 是在 `truffle-config.js` 文件中 `networks.devNode1` 的配置，指定部署到哪个区块链网络中。

### 使用自研命令行工具

使用方法
1. 需要在config文件里面配置私钥
tw-eth-cli transfer -t 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e -m 9.9 --config config.local.quorum.js 

2. 查看命令基本信息
tw-eth-cli

3. 帮助文档
tw-eth-cli help transfer 

4. 其他命令参考 `tw-eth-cli` 工程


