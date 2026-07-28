# AI 맞춤 영어 해석기 (Vercel 배포용)

## 프로젝트 파일 구조
- `index.html`: 프론트엔드 UI 및 이미지 크롭/영역 지정 기능
- `api/generate.js`: Gemini API 서버리스 백엔드 함수
- `package.json`: Vercel 프로젝트 설정
- `vercel.json`: Vercel 라우팅 설정

## Vercel 배포 방법
1. 이 압축 파일의 해제 후 생성된 파일들을 GitHub 레포지토리에 커밋하거나, Vercel CLI(`vercel`)로 직접 배포합니다.
2. Vercel 대시보드 -> **Settings** -> **Environment Variables**로 이동합니다.
3. Key: `GEMINI_API_KEY`, Value: 발급받은 Gemini API 키를 등록합니다.
