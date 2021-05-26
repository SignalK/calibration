# calibration
Signal K Node Server plugin to alter incoming data based a set of calibration values.


You configure it by entering the Signal K path and some pairs of input and output values. Each pair is a "known" calibration point, where you know what the input is and what the output should be.

Additionally you can enter a source id to specify the source of the data that the calibration should be applied to. Please refer to server's Data Browser for the ids in your system.

You can also specify the length of the period, like 2 * Pi for angles, to cap the output.

The units in Signal K are SI units, so for example angles are in radians.

![image](https://user-images.githubusercontent.com/1049678/100268587-ef688300-2f5d-11eb-9b5e-4358af94d110.png)

Build instructions:
```git clone git@github.com:SignalK/calibration.git
cd calibration
npm install && npm run build
npm run dev```

