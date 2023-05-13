import fs from "fs-extra";
import path from "path";
import { npmRunBuild } from "sx/utils/shell";

/**
 * createJsonCrudApi - a simple CRUD interface for record based JSON files
 *
 * Example:
 * ```
 * const bookmarksApi = createJsonCrudApi<DataType>(
 *  jsonPath,
 *  fileData
 * );
 * const { get, getAll, add, updateAll, update } = bookmarksApi;
 * ```
 */
function createJsonCrudApi<DataType = string>(
  file: string,
  data?: Record<string, DataType>
): {
  get: (key: string) => Promise<DataType>;
  getSync: (key: string) => DataType | undefined;
  getAll: () => Promise<Record<string, DataType>>;
  getAllSync: () => Record<string, DataType>;
  add: (key: string, data: DataType, options?: Options) => Promise<void>;
  update: (key: string, data: DataType, options?: Options) => Promise<void>;
  updateAll: (
    data: Record<string, DataType>,
    options?: Options
  ) => Promise<void>;
  delete: (key: string) => Promise<void>;
};
function createJsonCrudApi<Key extends string, DataType = string>(
  file: string,
  data?: Record<Key, DataType>
): {
  get: (key: Key) => Promise<DataType>;
  getSync: (key: Key) => DataType | undefined;
  getAll: () => Promise<Record<Key, DataType>>;
  getAllSync: () => Record<Key, DataType>;
  add: (key: Key, data: DataType, options?: Options) => Promise<void>;
  update: (key: Key, data: DataType, options?: Options) => Promise<void>;
  updateAll: (data: Record<Key, DataType>, options?: Options) => Promise<void>;
  delete: (key: Key) => Promise<void>;
};
function createJsonCrudApi<Key extends string, DataType>(
  file: string,
  data?: Record<Key, DataType>
) {
  const getAll = async () => {
    if (data) {
      return data;
    } else {
      data = (await readJsonFile(file)) as Record<Key, DataType>;
      if (!data) {
        await writeJsonFile(file, {});
        data = {} as Record<Key, DataType>;
      }
      return data;
    }
  };

  const getAllSync = () => {
    return data;
  };

  const get = async (key: Key): Promise<DataType> => {
    if (data) {
      return data[key];
    } else {
      data = (await readJsonFile(file)) as Record<Key, DataType>;
      if (!data) {
        await writeJsonFile(file, {});
        data = {} as Record<Key, DataType>;
      }
      return data[key];
    }
  };

  const getSync = (key: Key): DataType | undefined => {
    return data?.[key];
  };

  const updateAll = async (
    allData: { [key in Key]: DataType },
    options: Options = { sort: false }
  ) => {
    const data = options?.sort ? sortObject(allData) : allData;
    await writeJsonFile(file, data);
    console.log(`${file} updated!`);
    await npmRunBuild();
  };

  const add = async (
    key: Key,
    data: DataType,
    options: Options = { sort: false }
  ) => {
    if (key && data) {
      const allData = await getAll();
      allData[key] = data;
      await updateAll(allData, options);
    }
  };

  const update = add;

  const deleteOne = async (key: Key) => {
    if (key && data) {
      const allData = await getAll();
      delete allData[key];
      await updateAll(allData);
    }
  };

  return {
    get,
    getSync,
    getAll,
    getAllSync,
    add,
    updateAll,
    update,
    delete: deleteOne,
  };
}

type Options = {
  sort: boolean;
};

function sortObject<Obj extends Record<string, any>, K extends keyof Obj>(
  obj: Obj
) {
  const sortedKeys = Object.keys(obj).sort();
  const sortedData = {} as Obj;
  sortedKeys.forEach((key) => {
    sortedData[key as K] = obj[key];
  });
  return sortedData;
}

export type JsonPath = string;

export async function readJsonFile(
  fullPath: string
): Promise<{ [key: string]: any }> {
  try {
    console.log(`Reading file: ${fullPath}`);
    const fileData = await fs.readFile(fullPath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function writeJsonFile(
  fullPath: string,
  data: { [key: string]: any },
  options: { silent: boolean } = { silent: false }
) {
  if (!fullPath.startsWith(process.env.ROOT_DIR)) {
    console.error(
      "Error - writeJsonFile:\n",
      "fullPath must start with `process.env.ROOT_DIR` value.\n",
      "This is to prevent writing to the wrong directory.\n",
      "Resolution example:\n",
      "path.join(process.env.ROOT_DIR, 'user-data', 'tmp.json')\n",
      "to get the full path."
    );
    return;
  }
  const stringifiedData = JSON.stringify(data, null, 2);
  if (!options?.silent) {
    console.log(`Write to file: ${fullPath}`);
  }
  await ensureDirectoryExists(fullPath);
  await fs.writeFile(fullPath, stringifiedData);
}

export async function ensureDirectoryExists(fullPath: string) {
  const directoryPath = path.dirname(fullPath);
  try {
    await fs.access(directoryPath);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.mkdir(directoryPath, { recursive: true });
      console.log(`Created path: ${directoryPath}`);
    } else {
      throw error;
    }
  }
}

export default createJsonCrudApi;
