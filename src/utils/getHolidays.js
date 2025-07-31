export const getHolidays = async (year, month) => {
  const serviceKey =
    "j/5Nr278ZWTr9lpmEKCv4NpP/z9t1oJIfgjq0rnvLBp6/ESm3IwArDLeKR13Gsr2xDkFY0vGNpoYwn39JxvlqQ==";

  const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?ServiceKey=${serviceKey}&solYear=${year}&solMonth=${String(
    month
  ).padStart(2, "0")}&_type=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const items = data.response?.body?.items?.item;

    if (!items) return [];

    const holidays = Array.isArray(items)
      ? items.map((item) => item.locdate)
      : [items.locdate]; // 단일 객체도 배열로 처리

    return holidays;
  } catch (error) {
    console.error("공휴일 데이터 요청 실패:", error);
    return [];
  }
};
