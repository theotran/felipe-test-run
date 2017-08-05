const systemData = const systemData = {
  panelBoard: {
    // panelBoards: [
    //   {
    //     inputs: 4,
    //     inverters: [

    //     ]
    //   },
    //   {
    //     inputs: 4,
    //     inverters: [

    //     ]
    //   },
    // ],
    inputs: 6,
    inverters: [
      {
        inverterType: 'Something',
        inputs: 4,
        transformer: false,
        phase: 'three',
        x: 37,
        y: height/2,
        panels: [
          {
            model: 'Awesome',
            modules: 10,
            kW: 3.00,
            optimizer: true,
          },
          {
            model: 'Some other model',
            modules: 10,
            kW: 3.00,
            optimizer: false
          },
        ]
      },
      {
        inverterType: 'bam',
        inputs: 3,
        transformer: true,
        phase: 'three',
        x: 37,
        y: height/2,
        panels: [
          {
            model: 'Awesome',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'Some other model',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
        ]
      },
      {
        inverterType: 'IDK',
        inputs: 3,
        transformer: false,
        phase: 'three',
        x: 37,
        y: height/2,
        panels: [
          {
            model: 'Awesome',
            modules: 10,
            kW: 3.00,
            optimizer: true
          },
        ]
      },
      {
        inverterType: 'Another',
        inputs: 4,
        transformer: true,
        phase: 'three',
        x: 37,
        y: height/2,
        combiner: {
          inputs: 10,
          outputs: 2,
          usedOutputs: 2,
          fuse: '15A'
        },
        panels: [
          {
            model: 'Awesome',
            modules: 11,
            kW: 3.30,
            optimizer: null
          },
          {
            model: 'Some other model',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 11,
            kW: 3.30,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'Awesome',
            modules: 11,
            kW: 3.30,
            optimizer: null
          },
          {
            model: 'Some other model',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 11,
            kW: 3.30,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 11,
            kW: 3.30,
            optimizer: null
          },
          {
            model: 'OMGWTFBBQ',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
        ]
      },
      {
        inverterType: 'Wham',
        inputs: 2,
        transformer: false,
        phase: 'three',
        x: 37,
        y: height/2,
        panels: [
          {
            model: 'Awesome',
            modules: 10,
            kW: 3.00,
            optimizer: true
          },
          {
            model: 'Some other model',
            modules: 10,
            kW: 3.00,
            optimizer: false
          },
        ]
      },
      {
        inverterType: 'Last',
        inputs: 3,
        transformer: true,
        phase: 'three',
        x: 37,
        y: height/2,
        panels: [
          {
            model: 'Awesome',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
          {
            model: 'Some other model',
            modules: 10,
            kW: 3.00,
            optimizer: null
          },
        ]
      },
    ],
  },
  inverter: {},
  monitoring: true,
  tapBreak: true
  x: width * 0.65,
  y: height * 0.5,
  discoHeight: 35,
  discoWidth: 70,
  totalPanels: 0,
  totalInverters: 0,
  totalPanelBoardInputs: {},
  inverterRenderOrder: [],
  mostInverterInputs: 0,
  mostPanels: 0,
  mostCombinerInputs: 0,
};