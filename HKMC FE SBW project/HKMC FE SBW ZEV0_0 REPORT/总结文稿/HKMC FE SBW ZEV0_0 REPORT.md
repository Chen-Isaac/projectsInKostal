### 测试的软件版本
- internal version  ZEV0_0
- external version  A.00

### 测试中遇到的问题

1. PWM Output duty out of range
- 文档要求
> PWM On Duty Error: +/- 3% 

> | Button Status    | PWM On Duty
> | -------------    | -----------
> | Initial	         | 0%
> | P	             | 10%
> | R	             | 20%
> | N	             | 30%
> | D	             | 40%
> | Idle	         | 50%
> | P-Release	     | 70%
> | Fault	         | 90%

- 实测情况
> | Button Status    | PWM On Duty
> | -------------    | -----------
> | P	             | PWM output duty is 13.2%,out of range [7%-13%].
> | R	             | PWM output duty is 23.2%,out of range [17%-23%]
> | N	             | PWM output duty is 33.2%,out of range [27%-33%].
> | D	             | PWM output duty is 43.2%,out of range [37%-43%].
> | Idle	         | PWM output duty is 53.2%,out of range [47%-53%].
> | P-Release	     | PWM output duty is 73.2%,out of range [67%-73%].
> | Fault	         | PWM output duty is 93.2%,out of range [87%-93%].
详细测试数据及过程请参看附件内的Button Function文件夹。

2. Indicator Illumination部分文档描述有误
- 文档要求
> p14 8.3.3处的描述为：When CAN Signal(CF_Vcu_GarSelDisp) is Timeout, SbW shall use the PWM input.When CAN Signal is timeout and PWM is fault or initial or Not-Display, SbW shall turn off SbW’s highlight.
> p26 12.4.1处的描述为：If the gear position signal is timeout, SBW will turn all the indicators OFF. Once the gear position signal is available again, SBW should control the indicators accordingly again.
这两处文档有矛盾的地方。

- 实测情况
从实际测试情况来看，p14 8.3.3处的描述是合乎实测的，建议相关同事将文档更新。
详细测试数据及过程请参看附件内的testHighLightIndicatorBehavior文件夹。

3. Operation mode部分状态间切换不成立
- 文档要求
p29 状态机图片

- 实测情况归类
a. route：从Initialization mode到silence mode最后进入sleep
> |begining status  | from init to silence method  | silence result | from silence to sleep method| sleep result
> | -- |-- | --  | -- | --
> | $CF_Gway_DrvDrSw = close & IGN OFF when power on | set $CF_Gway_DrvDrSw = open then detect IGN OFF for 20s  | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1 | go to sleep, but current = 1.132mA out of range
> | $CF_Gway_DrvDrSw = B-CAN Timeout & IGN OFF when power on | set $CF_Gway_DrvDrSw = open then detect IGN OFF for 20s  | TX stopped,LED turned off,entered silence，current = 25mA|set $CF_Gway_DrvDrSw = close | go to sleep, but current = 1.124mA out of range
> | $CF_Gway_DrvDrSw = open & IGN OFF when power on | wait 20s then set $CF_Gway_DrvDrSw = close | TX stopped,LED turned off,entered silence，current = 1.131mA,directly go into the sleep mode,no through silence mode. | do nothing | current = 1.131mA out of range
> | $CF_Gway_DrvDrSw = close & IGN OFF when power on | set $CF_Gway_DrvDrSw = close  | TX stopped,LED turned off,entered silence，current = 25mA | wait for 15s | go to sleep, but current = 1.143mA out of range
> | $CF_Gway_DrvDrSw = close & IGN OFF when power on | set $CF_Gway_DrvDrSw = close | TX stopped,LED turned off,entered silence，current = 25mA|Disable Msg CGW1 and wait 20s | go to sleep, but current = 1.141mA out of range
> | $CF_Gway_DrvDrSw = open & IGN OFF when power on | wait 20s then set $CF_Gway_DrvDrSw = B-CAN Timeout | TX stopped,LED turned off,entered silence，current = 25mA | wait 15s then set $CF_Gway_DrvDrSw = close | go to sleep, but current = 1.131mA out of range
> | $CF_Gway_DrvDrSw = open & IGN OFF when power on | wait 20s then set $CF_Gway_DrvDrSw = B-CAN Timeout | TX stopped,LED turned off,entered silence，current = 25mA|Disable Msg CGW1 and wait 20s | go to sleep, but current = 1.131mA out of range
> | $CF_Gway_DrvDrSw = close & IGN OFF when power on | set $CF_Gway_DrvDrSw = B-CAN Timeout | TX stopped,LED turned off,entered silence，current = 25mA|wait 15s then set $CF_Gway_DrvDrSw = close | go to sleep, but current = 1.124mA out of range
> | $CF_Gway_DrvDrSw = close & IGN OFF when power on | set $CF_Gway_DrvDrSw = B-CAN Timeout | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1 then wait 20s | go to sleep, but current = 1.124mA out of range
详细测试数据及过程请参看附件内的checkOperationModeChangeFromIgnOnModeToInitModeToSilenceModeToSleep文件夹。

b. route：从IgnOn Mode到N-Park Mode到SilenceMode最后进入Sleep
> | from IgnOn to N-park to silence method  | silence result | from silence to sleep method| sleep result
> | -- | --  | -- | --
> | set ACC OFF, then IGN OFF, then set $CF_Gway_DrvDrSw = open, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | set $CF_Gway_DrvDrSw = close | go to sleep, but current = 1.136mA out of range
> | set ACC OFF, then IGN OFF, then set $CF_Gway_DrvDrSw = open, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1 | go to sleep, but current = 1.134mA out of range
> | set ACC OFF, then IGN OFF, then set $CF_Gway_DrvDrSw = B-CAN Timeout, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | wait 15s,then set $CF_Gway_DrvDrSw = close | go to sleep, but current = 1.124mA out of range
> | set ACC OFF, then IGN OFF, then set $CF_Gway_DrvDrSw = B-CAN Timeout, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1,then wait 20s  | go to sleep, but current = 1.131mA out of range
> | set ACC OFF, then IGN OFF, then set $CF_Gway_DrvDrSw = close, then wait 3min | TX stopped,LED turned off,current = 1.125mA，directly go into the sleep mode,no through silence mode. |  do nothing  | current = 1.125mA out of range
> | set ACC OFF, then IGN OFF, then set $CF_Gway_DrvDrSw = close, then wait 3min | TX stopped,LED turned off,current = 1.131mA，directly go into the sleep mode,no through silence mode. |  do nothing  | current = 1.131mA out of range
详细测试数据及过程请参看附件内的checkOperationModeChangeFromIgnOnModeToNParkModeToSilenceModeToSleep文件夹。

c. route：从IgnOn Mode到N-WASH Mode（经由N-PARK mode）到SilenceMode最后进入Sleep
> | from IgnOn to N-WASH | through N-PARK or not through N-PARK to silence | silence result | from silence to sleep method| sleep result
> | -- | --  | -- | -- | --
> | set ACC ON, then IGN OFF | set $CF_Gway_DrvDrSw = close, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | wait 15s | current = 25.498mA, not in sleep mode
> | set ACC ON, then IGN OFF | set $CF_Gway_DrvDrSw = close, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1, then wait 20s | current = 25.5mA, not in sleep mode
> | set ACC ON, then IGN OFF | set ACC OFF,then set $CF_Gway_DrvDrSw = close, then wait 3min | TX stopped,LED turned off,current = 1.134mA，directly go into the sleep mode,no through silence mode. | do nothing | current = 1.134mA out of range 
> | set ACC ON, then IGN OFF | set ACC OFF,then set $CF_Gway_DrvDrSw = close, then wait 3min | TX stopped,LED turned off,current = 1.136mA，directly go into the sleep mode,no through silence mode. | do nothing | current = 1.136mA out of range
> | set ACC ON, then IGN OFF | set $CF_Gway_DrvDrSw = open, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | set $CF_Gway_DrvDrSw = close | current = 25.402mA, not in sleep mode
> | set ACC ON, then IGN OFF | set $CF_Gway_DrvDrSw = open, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1| current = 25.489mA, not in sleep mode
> | set ACC ON, then IGN OFF | set ACC OFF,then set $CF_Gway_DrvDrSw = open, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | set $CF_Gway_DrvDrSw = close | current = 1.125mA out of range 
> | set ACC ON, then IGN OFF | set ACC OFF,then set $CF_Gway_DrvDrSw = open, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1 | current = 1.141mA out of range 
> | set ACC ON, then IGN OFF | set $CF_Gway_DrvDrSw = B-CAN Timeout, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | wait 15s, then set $CF_Gway_DrvDrSw = close | current = 25.482mA, not in sleep mode
> | set ACC ON, then IGN OFF | set $CF_Gway_DrvDrSw = B-CAN Timeout, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1, then wait 20s| current = 25.488mA, not in sleep mode
> | set ACC ON, then IGN OFF | set ACC OFF,then set $CF_Gway_DrvDrSw = B-CAN Timeout, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | wait 15s,then set $CF_Gway_DrvDrSw = close | current = 1.133mA out of range 
> | set ACC ON, then IGN OFF | set ACC OFF,then set $CF_Gway_DrvDrSw = B-CAN Timeout, then wait 3min | TX stopped,LED turned off,entered silence，current = 25mA | Disable Msg CGW1, then wait 20s | current = 1.143mA out of range 

- 实测情况小结
a. 睡眠电流超限，大于1mA
b. 在N-WASH模式下（即ACC ON时）无法按状态机的描述进入睡眠模式
c. IGN off下当$CF_Gway_DrvDrSw = close时，3min后，不经过silence模式，直接进入睡眠模式
d. init下当$CF_Gway_DrvDrSw = open时，20s关门后，不经过silence模式，直接进入睡眠模式
e. 文档中Init模式到sleep模式的直接切换路径描述不清，和init到silence模式下的逻辑有重合之处，希望尽快更正
详细测试数据及过程请参看附件内的checkOperationModeChangeFromIgnOnModeToNWashModeToSilenceModeToSleep文件夹。






