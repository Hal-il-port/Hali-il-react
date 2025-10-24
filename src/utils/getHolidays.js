export const getHolidays = async (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  try {
    const res = await fetch(
      `https://hal-il.site/api/schedules/holidays?year=${year}&month=${month}`
    );

    // 상태 코드 체크
    if (!res.ok) {
      console.error("공휴일 API 요청 실패:", res.status, res.statusText);
      return [];
    }

    // Content-Type 체크
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("공휴일 API가 JSON을 반환하지 않음:", contentType);
      return [];
    }

    // JSON 파싱 시 오류 대비
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("JSON 파싱 실패:", err);
      return [];
    }

    const items = data.response?.body?.items?.item;
    if (!items) return [];

    return Array.isArray(items)
      ? items.map((item) => item.locdate)
      : [items.locdate];
  } catch (error) {
    console.error("공휴일 데이터 요청 중 에러 발생:", error);
    return [];
  }
};
