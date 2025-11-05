# JS 기반 DTO 설계 전략 문서

## 목적

JavaScript로 초기 개발하되, 프로젝트 성장 시 TypeScript로 원활하게 전환하기 위한 DTO 설계 기준을 정의한다.

---

## DTO 설계 원칙

| 항목 | 기준 |
|------|------|
| DTO 형태 | Class 기반 |
| 필드 주입 방식 | 생성자 파라미터 구조 분해 |
| 유효성 검증 | DTO 외부 함수로 분리 |
| 변경 용이성 | DTO 내부 필드 변경 시 외부 영향 최소화 |
| 확장 방향 | TS 도입 시 타입/데코레이터 추가 |

---

## DTO 구조 정의

### DTO 생성 규칙

1. DTO는 `class`로 정의한다.
2. 요청 데이터는 객체 형태로 받고 구조 분해하여 주입한다.
3. DTO 내부에 비즈니스 로직을 넣지 않는다.

**예시:**

```javascript
// dto/CreateUserDto.js
class CreateUserDto {
  constructor({ nickname, email }) {
    this.nickname = nickname;
    this.email = email;
  }
}

module.exports = CreateUserDto;
```

---

## DTO 검증 규칙

### Validation 별도 함수로 분리

- DTO 생성과 검증을 분리한다.
- TS 전환 시 `class-validator`로 자연스럽게 대체 가능

**예시:**

```javascript
// validation/userValidation.js
function validateCreateUser(dto) {
  if (!dto.email) return "email required";
  if (!dto.nickname) return "nickname required";
  return null;
}

module.exports = validateCreateUser;
```

---

## 컨트롤러 사용 예시

```javascript
const CreateUserDto = require("../dto/CreateUserDto");
const validateCreateUser = require("../validation/userValidation");

app.post("/users", (req, res) => {
  const dto = new CreateUserDto(req.body);
  const error = validateCreateUser(dto);

  if (error) return res.status(400).json({ message: error });
  return res.json(dto);
});
```

---

## TS 전환 계획

| JS 단계 | TS 단계 |
|---------|---------|
| DTO class 유지 | class + 타입 선언 |
| 외부 validation 함수 | class-validator 데코레이터 적용 |
| 필드 자유 입력 | 타입 강제 및 IDE 자동완성 강화 |

### TS 적용 예 (미래 단계)

```typescript
export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsEmail()
  email: string;
}
```

---

## 기대 효과

| 효과 | 설명 |
|------|------|
| 확장성 | 규모 커질수록 TS로 무리 없이 전환 |
| 유지보수성 | DTO 구조 통일 → 코드 가독성 향상 |
| 유연성 | JS 초기 개발 속도 확보 |
| 기술 일관성 | Spring 스타일 데이터 계층 유지 |

---

## 요약

- **지금**: JS + Class DTO + 함수 기반 validation
- **나중**: TS + Decorator validation + 타입 시스템
- **목적**: 초기 속도 + 이후 안정성 모두 확보
