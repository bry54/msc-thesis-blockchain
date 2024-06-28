export const addSummaries =(records: any[]): any[] => {
  // Sort records by timestamp
  records.sort((a, b) => {
    const aTime = a.Timestamp.seconds * 1000 + a.Timestamp.nanos / 1000000;
    const bTime = b.Timestamp.seconds * 1000 + b.Timestamp.nanos / 1000000;
    return aTime - bTime;
  });

  // Iterate through the sorted records and generate summaries
  for (let i = 1; i < records.length; i++) {
    const currentRecord = records[i].Record;
    const previousRecord = records[i - 1].Record;
    const changes: any = {};

    Object.keys(currentRecord).forEach(key => {
      if (currentRecord[key] !== previousRecord[key]) {
        changes[key] = {
          from: previousRecord[key],
          to: currentRecord[key]
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      records[i].summary = {
        summary: 'Record updated',
        changes: changes,
        localTimestamp: convertTimestampToLocalTime(records[i].Timestamp)
      };
    } else {
      records[i].summary = {
        summary: 'No changes',
        localTimestamp: convertTimestampToLocalTime(records[i].Timestamp)
      };
    }
  }

  // Handle the first record
  if (records.length > 0) {
    records[0].summary = {
      summary: 'Initial record',
      localTimestamp: convertTimestampToLocalTime(records[0].Timestamp)
    };
  }

  return records;
}

export const convertTimestampToLocalTime =(timestamp: {seconds: number, nanos: number}) => {
  const utcDate = new Date(timestamp.seconds * 1000 + timestamp.nanos / 1000000);
  return utcDate.toLocaleString();
}
