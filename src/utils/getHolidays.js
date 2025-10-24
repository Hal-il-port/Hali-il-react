export const getHolidays = async (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  try {
    const url = `https://hal-il.site/api/schedules/holidays?year=${year}&month=${month}`;
    console.log("[공휴일 요청 URL]", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    // 1️⃣ 상태 코드 확인
    if (!res.ok) {
      const text = await res.text(); // HTML이라도 내용 보기 위해 text로 받음
      console.error(
        `공휴일 API 요청 실패: ${res.status} ${res.statusText}\n응답 내용:`,
        text.slice(0, 200)
      );
      return [];
    }

    // 2️⃣ Content-Type 확인
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error(
        "공휴일 API가 JSON을 반환하지 않음:",
        contentType,
        "\n응답 내용:",
        text.slice(0, 200)
      );
      return [];
    }

    // 3️⃣ JSON 파싱
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("공휴일 API JSON 파싱 실패:", err);
      return [];
    }

    // 4️⃣ 응답 구조 확인
    const items = data.response?.body?.items?.item;
    if (!items) {
      console.warn("공휴일 데이터 없음 또는 구조 불일치:", data);
      return [];
    }

    // 5️⃣ 날짜 배열 변환
    const holidayList = Array.isArray(items)
      ? items.map((item) => item.locdate)
      : [items.locdate];

    console.log("[공휴일 데이터 수신 성공]", holidayList);
    return holidayList;
  } catch (error) {
    console.error("공휴일 데이터 요청 중 에러 발생:", error);
    return [];
  }
};
