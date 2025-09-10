export const getHolidays = async (year, month) => {
  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/holidays?year=${year}&month=${month}`
    );

    const text = await res.text(); // 먼저 텍스트로 받기
    if (!text) return []; // body 없으면 빈 배열 반환

    const data = JSON.parse(text); // JSON으로 변환
    const items = data.response?.body?.items?.item;
    if (!items) return [];

    return Array.isArray(items)
      ? items.map((item) => item.locdate)
      : [items.locdate];
  } catch (error) {
    console.error("공휴일 데이터 요청 실패:", error);
    return [];
  }
};
