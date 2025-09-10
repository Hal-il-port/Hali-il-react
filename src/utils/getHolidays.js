export const getHolidays = async (year, month) => {
  try {
    const res = await fetch(
      `/api/schedules/holidays?year=${year}&month=${month}`
    ); // 내 서버 경유
    const data = await res.json();

    const items = data.response?.body?.items?.item;
    if (!items) return [];

    return Array.isArray(items)
      ? items.map((item) => item.locdate)
      : [items.locdate];
  } catch (error) {
    console.error("공휴일 데이터 요청 실패:", error);
    return [];
  }
}
