<template>
  <h2></h2>

  <div v-if="!loading">
    <!-- Connection buttons -->
    <div v-if="bluetoothAvailable" class="btn-group d-grid gap-2" role="group" aria-label="micro:bit controlls">
      <!-- Display only if the microbit is NOT already connected -->
      <button v-if="!microbit.isConnected" type="button" class="btn btn-success" @click="connectMicrobit()">
        <span class="iconify" data-icon="mdi:bluetooth-connect" data-inline="true"></span>
        Connect to micro:bit
      </button>
      <!-- Display only when the micro:bit IS already connected -->
            <button  v-if="microbit.isConnected" id="startProgram" type="button" class="btn btn-success rounded-pill"  @click.self="alert(); startProgram($event)" >
        <span class="iconify" data-icon="mdi:bluetooth-on" data-inline="true"></span>
        Start
            </button>
            <br>
            <br>
            <!-- Choose program buttons -->
            <h3 v-if="microbit.isConnected">Select Program</h3>
            <div v-if="microbit.isConnected" class="btn-group" role="group">
             <input id="btnradio1" type="radio"  class="btn-check"  name="btnradio"  autocomplete="off">
             <label class="btn btn-outline-primary" for="btnradio1">High</label>

             <input id="btnradio2" type="radio"  class="btn-check"  name="btnradio"  autocomplete="off" checked>
             <label class="btn btn-outline-primary" for="btnradio2">Medium</label>

             <input id="btnradio3" type="radio"  class="btn-check"  name="btnradio"  autocomplete="off">
             <label class="btn btn-outline-primary" for="btnradio3">Low</label>
            </div>
            <br>
            <br>
      <button v-if="microbit.isConnected" type="button" class="btn btn-danger rounded-pill" @click="disconnectMicrobit()">
        <span class="iconify" data-icon="mdi:bluetooth-off" data-inline="true"></span>
        Disconnect
      </button>
    </div>

    <div v-else class="alert alert-danger" role="alert">Bluetooth adapter not available.</div>
  </div>

  <!-- Loading spinner -->
  <div v-else class="spinner-grow text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <!-- Only display this entire block if there is a micro:bit connected -->
  <div v-if="microbit.isConnected" id="microbit-info">
  </div>
</template>

<script>
export default {
  name: 'Microbit',
  data() {
    return {
      loading: true,
      bluetoothAvailable: false,
      playbackRate: 1.0,
      adjustedPlaybackRate: 1.0,
      xPercent: 50,
      yPercent: 50,
      zPercent: 50,
      microbit: {
        isConnected: false,
        device: null,
        accelerometerDataCharacteristic: null,
        accelerometerPeriodCharacteristic: null,
        accelerometer: {
          count: 0,
          x: 0,
          y: 0,
          z: 0
        }
      },
      microbitUuid: {
        /**
         * Services
         */
        
        genericAccess: ['00001800-0000-1000-8000-00805f9b34fb', 'Generic Access'],
        genericAttribute: ['00001801-0000-1000-8000-00805f9b34fb', 'Generic Attribute'],
        deviceInformation: ['0000180a-0000-1000-8000-00805f9b34fb', 'Device Information'],
        accelerometerService: ['e95d0753-251d-470a-a062-fa1922dfa9a8', 'Accelerometer Service'],
        magnetometerService: ['e95df2d8-251d-470a-a062-fa1922dfa9a8', 'Magnetometer Service'],
        buttonService: ['e95d9882-251d-470a-a062-fa1922dfa9a8', 'Button Service'],
        ioPinService: ['e95d127b-251d-470a-a062-fa1922dfa9a8', 'IO Pin Service'],
        ledService: ['e95dd91d-251d-470a-a062-fa1922dfa9a8', 'LED Service'],
        eventService: ['e95d93af-251d-470a-a062-fa1922dfa9a8', 'Event Service'],
        dfuControlService: ['e95d93b0-251d-470a-a062-fa1922dfa9a8', 'DFU Control Service'],
        temperatureService: ['e95d6100-251d-470a-a062-fa1922dfa9a8', 'Temperature Service'],
        uartService: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e', 'UART Service'],
        /**
         * Characteristics
         */
        deviceName: ['00002a00-0000-1000-8000-00805f9b34fb', 'Device Name'],
        appearance: ['00002a01-0000-1000-8000-00805f9b34fb', 'Appearance'],
        peripheralPreferredConnectionParameters: ['00002a04-0000-1000-8000-00805f9b34fb', 'Peripheral Preferred Connection Parameters'],
        serviceChanged: ['00002a05-0000-1000-8000-00805f9b34fb', 'Service Changed'],
        modelNumberString: ['00002a24-0000-1000-8000-00805f9b34fb', 'Model Number String'],
        serialNumberString: ['00002a25-0000-1000-8000-00805f9b34fb', 'Serial Number String'],
        hardwareRevisionString: ['00002a27-0000-1000-8000-00805f9b34fb', 'Hardware Revision String'],
        firmwareRevisionString: ['00002a26-0000-1000-8000-00805f9b34fb', 'Firmware Revision String'],
        manufacturerNameString: ['00002a29-0000-1000-8000-00805f9b34fb', 'Manufacturer Name String'],
        accelerometerData: ['e95dca4b-251d-470a-a062-fa1922dfa9a8', 'Accelerometer Data'],
        accelerometerPeriod: ['e95dfb24-251d-470a-a062-fa1922dfa9a8', 'Accelerometer Period'],
        magnetometerData: ['e95dfb11-251d-470a-a062-fa1922dfa9a8', 'Magnetometer Data'],
        magnetometerPeriod: ['e95d386c-251d-470a-a062-fa1922dfa9a8', 'Magnetometer Period'],
        magnetometerBearing: ['e95d9715-251d-470a-a062-fa1922dfa9a8', 'Magnetometer Bearing'],
        magnetometerCalibration: ['e95db358-251d-470a-a062-fa1922dfa9a8', 'Magnetometer Calibration'],
        buttonAState: ['e95dda90-251d-470a-a062-fa1922dfa9a8', 'Button A State'],
        buttonBState: ['e95dda91-251d-470a-a062-fa1922dfa9a8', 'Button B State'],
        pinData: ['e95d8d00-251d-470a-a062-fa1922dfa9a8', 'Pin Data'],
        pinADConfiguration: ['e95d5899-251d-470a-a062-fa1922dfa9a8', 'Pin AD Configuration'],
        pinIOConfiguration: ['e95db9fe-251d-470a-a062-fa1922dfa9a8', 'Pin IO Configuration'],
        pwmControl: ['e95dd822-251d-470a-a062-fa1922dfa9a8', 'PWM Control'],
        ledMatrixState: ['e95d7b77-251d-470a-a062-fa1922dfa9a8', 'LED Matrix State'],
        ledText: ['e95d93ee-251d-470a-a062-fa1922dfa9a8', 'LED Text'],
        scrollingDelay: ['e95d0d2d-251d-470a-a062-fa1922dfa9a8', 'Scrolling Delay'],
        microbitRequirements: ['e95db84c-251d-470a-a062-fa1922dfa9a8', 'MicroBit Requirements'],
        microbitEvent: ['e95d9775-251d-470a-a062-fa1922dfa9a8', 'MicroBit Event'],
        clientRequirements: ['e95d23c4-251d-470a-a062-fa1922dfa9a8', 'Client Requirements'],
        clientEvent: ['e95d5404-251d-470a-a062-fa1922dfa9a8', 'Client Event'],
        dfuControl: ['e95d93b1-251d-470a-a062-fa1922dfa9a8', 'DFU Control'],
        temperature: ['e95d9250-251d-470a-a062-fa1922dfa9a8', 'Temperature'],
        temperaturePeriod: ['e95d1b25-251d-470a-a062-fa1922dfa9a8', 'Temperature Period'],
        txCharacteristic: ['6e400002-b5a3-f393-e0a9-e50e24dcca9e', 'Tx Characteristic'],
        rxCharacteristic: ['6e400003-b5a3-f393-e0a9-e50e24dcca9e', 'Rx Characteristic']
      }
    };
  },
  // Runs when the component is loaded
  mounted: function () {
    /**
     * If the bluetooth obiect is undefined or the bluetooth adapter is present but
     * is unavailable, update a variable with the availability.
     * A loading spinner is used to cover this check until it is done to stop the UI changing quickly
     * as the adapter is dicsovered.
     */
    if (typeof navigator.bluetooth !== 'undefined') {
      navigator.bluetooth
        .getAvailability()
        .then((available) => {
          if (available) this.bluetoothAvailable = true;
          else this.bluetoothAvailable = false;
        })
        .then(() => {
          this.loading = false;
        });
    } else {
      this.bluetoothAvailable = false;
      this.loading = false;
    }
  },
  methods: {
    /**
     * Event handler that runs whenever new accelerometer data is received
     */
    
    alert: function(){
      alert('Program Started');
    },
    

    /**
     * Method to handle connecting to the micro:bit using Bluetooth Low Energy (BLE) and
     * web bluetooth.
     */
    async connectMicrobit() {
      console.log('Requesting micro:bit Bluetooth devices... ');

      // Create a list of all possible micro:bit service UUIDs
      let microbitOptionalServices = [
        this.microbitUuid.genericAccess[0],
        this.microbitUuid.genericAttribute[0],
        this.microbitUuid.deviceInformation[0],
        this.microbitUuid.accelerometerService[0],
        this.microbitUuid.magnetometerService[0],
        this.microbitUuid.buttonService[0],
        this.microbitUuid.ioPinService[0],
        this.microbitUuid.ledService[0],
        this.microbitUuid.eventService[0],
        this.microbitUuid.dfuControlService[0],
        this.microbitUuid.temperatureService[0],
        this.microbitUuid.uartService[0]
      ];

      // Check if the bluetooth adapter exists and is accessible
      if (!navigator.bluetooth) {
        console.error('Bluetooth adapter not available');
      } else {
        // Search for micro:bit devices
        navigator.bluetooth
          .requestDevice({
            filters: [{ namePrefix: 'BBC micro:bit' }],
            optionalServices: microbitOptionalServices
          })
          .then((device) => {
            // Successful connection
            console.log('Connection successful!');
            // Store the bluetooth device object in a variable
            this.microbit.device = device;
            // Add an event listener to run on disconnect
            device.addEventListener('gattserverdisconnected', this.onDisconnected);
            // Initiate the connection
            return device.gatt.connect();
          })
          .then((server) => {
            // Set the isConnected variable to true
            this.microbit.isConnected = true;
            console.log('Getting Accelerometer service (UUID: ' + this.microbitUuid.accelerometerService[0] + ')... ');
            // Get the accelerometer service (if it's not enabled, the error will be caught below)
            return server.getPrimaryService(this.microbitUuid.accelerometerService[0]);
          })
          .then((service) => {
            console.log('Getting Accelerometer data characteristic... ');
            // Setup the accelerometer receiver
            service
              .getCharacteristic(this.microbitUuid.accelerometerData[0])
              .then((dataChar) => {
                this.microbit.accelerometerDataCharacteristic = dataChar;
                console.log('Starting accelerometer data notifications... ');
                return dataChar
                  .startNotifications()
                  .then(() => {
                    // Add an event listener to run whenever new accelerometer data is received
                    dataChar.addEventListener('characteristicvaluechanged', this.accelerometerDataChanged);
                    // Get the acclerometer period (currently not used)
                    // console.log('Getting Accelerometer period characteristic... ', false);
                    // service
                    //   .getCharacteristic(this.microbitUuid.accelerometerPeriod[0])
                    //   .then((periodChar) => {
                    //     this.microbit.accelerometerPeriodCharacteristic = periodChar;
                    //     console.log("<font color='green'>OK</font>", true);
                    //   })
                    //   .catch((error) => {
                    //     console.error(error);
                    //   });
                  })
                  .catch((error) => {
                    // Device not found or no bluetooth adapter
                    console.error(error);
                  });
              })
              .catch((error) => {
                // Error while connecting to device
                console.error(error);
              });
          })
          .catch((error) => {
            // Error whule getting accelerometer data
            console.error(error);
          });
      }
    },

    /**
     * Method to disconnect the micro:bit BLE connection
     */
    disconnectMicrobit() {
      console.log('Disconnecting... ');
      // Ensure the device exists before attemting to disconnect
      if (!this.microbit.device) {
        console.error('There is no device connected.');
      } else {
        // Ensure the stored device object is actually connected
        if (this.microbit.device.gatt.connected) {
          // Disconnect the Bluetooth connection
          this.microbit.device.gatt.disconnect();
        } else {
          console.error('There is no device connected.');
        }
      }
    },

    /**
     * Event handler to run when a BLE device is disconnected
     */
    onDisconnected() {
      console.log('BLE Disconnect!');
      // Update the isConnected varaible to ensure the UI updates
      this.microbit.isConnected = false;
    }
  }
};


</script>
