# calibration
Signal K Node Server plugin to alter incoming data based a set of calibration values.


You configure it by entering the Signal K path (period does not work yet so please ignore it) and some pairs of input and output values. Each pair is a "known" calibration point, where you know what the input is and what the output should be.

The units in Signal K are SI units, so for example angles are in radians.

Below is an example case with for wind angle where we have three calibration points:
- for input -180 degrees the output should be -175 degrees
- for input 0 degrees the output should be 10 degrees
- for input 180 degrees the output should be 172 degrees

In radians:
![image](https://user-images.githubusercontent.com/1049678/49245515-36791780-f41b-11e8-89c7-286ed4be18f4.png)

The plugin includes a tiny webapp to show the calibrations in the system visually. The visualisation shows the *difference* of the input and output values, but you enter absolute input and output values.

![image](https://user-images.githubusercontent.com/1049678/49246127-d2efe980-f41c-11e8-864c-8d67f6d30710.png)




