bluetooth.onBluetoothConnected(function () {
  basic.showIcon(IconNames.Yes)
  basic.clearScreen()
  bluetooth.startIOPinService()
  if (pins.digitalReadPin(DigitalPin.P8) == 1) {
      while (true) {
          pins.servoWritePin(AnalogPin.P8, 180)
          basic.pause(500)
          pins.servoWritePin(AnalogPin.P8, 0)
          basic.pause(500)
      }
  }
})
bluetooth.onBluetoothDisconnected(function () {
  basic.showIcon(IconNames.No)
  basic.clearScreen()
  pins.digitalWritePin(DigitalPin.P8, 0)
})
