// src/utils/snowflake-id-generator.ts
// @ts-ignore
import SnowflakeID from 'node-snowflake-id';

const sfid = new SnowflakeID({
    epoch: Date.now(), // 自定义纪元开始时间戳
    workerIdBits: 5,   // 工作机器 ID 所占位数
    dataCenterIdBits: 5, // 数据中心 ID 所占位数
    sequenceBits: 12,  // 序列号所占位数
    workerId: 1,       // 工作机器 ID
    dataCenterId: 1    // 数据中心 ID
  });
  
export const generateId = () => {
    return sfid.generate();
}