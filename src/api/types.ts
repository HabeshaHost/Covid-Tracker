export type ResponseType<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type NationalResponse = ResponseType<NationalData>;
export type StateDataResponse = ResponseType<StateData>;

export type NationalData = {
  date: string;
  states: number;
  cases: {
    total: {
      value: number;
      calculated: {
        populationPercent: number;
        changeFromPriorDay: number;
        sevenDayChangePercent: number;
      };
    };
  };
  testing: {
    total: {
      value: number;
      calculated: {
        populationPercent: number;
        changeFromPriorDay: number;
        sevenDayChangePercent: number;
      };
    };
  };
  outcomes: {
    hospitalized: {
      currently: {
        value: number;
        calculated: {
          populationPercent: number;
          changeFromPriorDay: number;
          sevenDayChangePercent: number;
          sevenDayAverage: number;
        };
      };
      inIcu: {
        currently: {
          value: number;
          calculated: {
            populationPercent: number;
            changeFromPriorDay: number;
            sevenDayChangePercent: number;
            sevenDayAverage: number;
          };
        };
      };
      onVentilator: {
        currently: {
          value: number;
          calculated: {
            populationPercent: number;
            changeFromPriorDay: number;
            sevenDayChangePercent: number;
            sevenDayAverage: number;
          };
        };
      };
    };
    death: {
      total: {
        value: number;
        calculated: {
          populationPercent: number;
          changeFromPriorDay: number;
          sevenDayChangePercent: number;
          sevenDayAverage: number;
        };
      };
    };
  };
};

export type StateMetadata = {
  name: string;
  stateCode: string;
};

type CalculatedData = {
  populationPercent: number;
  changeFromPriorDay: number;
  sevenDayChangePercent: number;
  sevenDayAverage?: number;
};

type OutcomeData = {
  value: number;
  calculated: CalculatedData;
};

type HospitalizedData = {
  total?: {
    value: number;
  };
  currently: {
    value: number;
    calculated: CalculatedData;
  };
  inIcu?: {
    total?: {
      value: number;
    };
    currently: {
      value: number;
      calculated: CalculatedData;
    };
  };
  onVentilator?: {
    total?: {
      value: number;
    };
    currently?: {
      value: number;
      calculated: CalculatedData;
    };
  };
};

type TestData = {
  value: number;
  calculated: CalculatedData;
};

export type TestMetrics = {
  total: TestData;
  pending?: TestData;
  encounters?: TestData;
  specimens?: TestData;
  positive?: TestData;
  negative?: TestData;
};

export type StateDataTests = {
  pcr: TestMetrics;
  antibody?: TestMetrics;
  antigen?: TestMetrics;
};

//{ pcr: TestsData; antibody?: TestsData | undefined; antigen?: TestsData | undefined; }
export type StateData = {
  date: string;
  state: string;
  meta: {
    dataQualityGrade: string;
    updated: string;
    tests: {
      totalSource: string;
    };
  };
  cases: {
    total: TestData;
    confirmed: TestData;
    probable?: TestData;
  };
  tests: StateDataTests;
  outcomes: {
    recovered?: OutcomeData;
    hospitalized: HospitalizedData;
    death: {
      total: OutcomeData;
      confirmed?: OutcomeData;
      probable?: OutcomeData;
    };
  };
};
