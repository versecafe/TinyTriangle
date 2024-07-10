import AsyncStorage from "@react-native-async-storage/async-storage";

export type ControlState = "ON" | "OFF" | "MIXED";

type SetterFunctions = {
  setShowAnalytics: React.Dispatch<React.SetStateAction<ControlState>>;
  setShowProjectSettings: React.Dispatch<React.SetStateAction<ControlState>>;
  setShowLogs: React.Dispatch<React.SetStateAction<ControlState>>;
  setShowDeployments: React.Dispatch<React.SetStateAction<ControlState>>;
  setShowIntegrations: React.Dispatch<React.SetStateAction<ControlState>>;
  setShowUsage: React.Dispatch<React.SetStateAction<ControlState>>;
  setShowOrganizationSettings: React.Dispatch<
    React.SetStateAction<ControlState>
  >;
};

type AsyncStorageFunctions<T extends SetterFunctions> = {
  [K in keyof T]: (value: ControlState) => Promise<void>;
};

export class Settings {
  private storageSetters: Partial<AsyncStorageFunctions<SetterFunctions>>;

  constructor(setters: SetterFunctions) {
    this.storageSetters = {};

    Object.keys(setters).forEach((key) => {
      const setterKey = key as keyof SetterFunctions;
      this.storageSetters[setterKey] = async (value: ControlState) => {
        try {
          await AsyncStorage.setItem(setterKey, value);
          setters[setterKey](value);
        } catch (error) {
          console.error(`Error setting item ${setterKey}:`, error);
        }
      };
    });
  }

  async set(key: keyof SetterFunctions, value: ControlState): Promise<void> {
    if (this.storageSetters[key]) {
      this.storageSetters[key]!(value);
      await AsyncStorage.setItem(key, value);
    } else {
      console.error(`Setter for ${key} not found.`);
    }
  }

  async get(key: keyof SetterFunctions): Promise<ControlState | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value as ControlState | null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async sync() {
    const keys = Object.keys(this.storageSetters) as Array<
      keyof SetterFunctions
    >;
    for (const key of keys) {
      const value = await this.get(key);
      if (value) {
        this.storageSetters[key]!(value);
      }
    }
  }
}
