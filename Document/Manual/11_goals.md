##Chapter 11. Goal

* 상세한 진행은 https://trello.com/b/LYG2yy6n/coconut 를 참고하세요.

###1차 목표
1. 버그 수정 및 메뉴얼 정비 (complete)
2. 2015년 5월 7일 정식 업데이트 (complete)

###2차 목표
1. 2015년 6월 10일 업데이트
  - 스케쥴 기능 추가 (특정 작업을 등록해서 일정 시간에 실행할 수 있도록) (진행 중!)
  
  - 외부 솔루션과의 연동에 대한 표준안 작성/적용 (complete : plugin 시스템 도입으로 해결)
  - 알림 기능 추가
    - pushbullet(or node-twitter) 연결해서 긴급 메세지를 담당자에게 전송 기능 추가  (complete : pushbullet 연동)
  - 원격 저장소와 동기화 기능 (complete)
  - 원격 저장소에서 파일 내려받기 (complete)
  - Tool의 모니터링 디자인&기능 개선
    - Tool에서 system card에 network traffic 정보 추가 (complete)
  - 기타 기능 개선
    - 파일 업로드에 대한 error 정보를 Tool로 전송, 표기하기 (complete)
    

2. 2015년 7월 09일 업데이트
  - Tool을 nodejs로 기동하도록 수정. 별도 웹서버 제거
  - 보안 개선
    - Tool / Manager 간 모든 통신을 http를 https로 개선
  - Tool의 모니터링 디자인&기능 개선
    - memory, disk, network 모니터링 정보를 각 코어별로 상세히 볼 수 있는 기능 추가
    - 관리 대상인 process별 cpu/memory 사용률 모니터링 기능 추가 
    - Tool에서 system card를 확장하여 모니터링 정보를 상세히 볼 수 있는 기능 디자인 및 기능 추가
  - 기타 기능 개선
    - 시스템 별 고유 인덱스 생성 방법 변경
  
###이후 작업들
-  중요 로그 정보 검색/통계 지원
-	플러그인 시스템 지원
-	docker의 가상 ip 문제 검토
-	aws ,azura 연동
