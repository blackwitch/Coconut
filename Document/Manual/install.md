###Chapter 6. Install

 Coconut을 사용하기 위해서는 사전에 설치해야 할 몇 가지 제품이 있습니다. 아래 내용을 참고하여 설치를 진행해 주시기 바랍니다.

6.1. Required Packages

	Redis (Manager에 각종 저장 정보를 기록하기 위함)
	httpd (Tool을 활용하기 위함)
	nodejs
	curl (Agent에 curl을 활용한 기능을 사용할 경우 필요함.)

6.2. Install Redis
현재 Manager와 Agent가 Redis로 접근할 때 pw없이 접근합니다. 참고하세요. Redis는 별도의 서버 혹은 Manager가 설치된 동일 서버에 설치하여도 문제없이 가동될 정도로 처리량이 많지 않습니다. docker를 사용하고 있다면 redis image를 다운받아 가동한다면 더욱 쉽게 설치하실 수 있습니다. Coconut은 Redis의 기본 포트를 사용하고 있으며, 원한다면 Coconut Manager 프로젝트에 포함된 "config.js"파일을 직접 수정하여 사용하실 수 있습니다.

6.3. Installing Coconut Manager/Agent
아래의 순서대로 진행하시기 바랍니다..
1. CoconutManager/Agent 폴더를 그대로 원하는 위치에 복사
2. CoconutManager/Agent 폴더에서 npm install 실행
3. config.js를 환경에 맞게 수정. 상세 설명은 코드 주석을 참고하세요.
  (Coconut Agent에 포함된 config.js 파일과 동일하며, 해당 파일이 변경되면 Manager/Agent에도 동일하게 배포하여 사용해야 합니다.)
4. app_mng.js를 실행

(* 현재 사용중인 Agent들을 구별하기 위한 키는 해당 시스템의 IP(NIC 리스트 중 마지막 IP를 기준으로 결정)를 기반으로 하고 있습니다. 이는 하나의 물리적인 서버에 두 개의 agent가 존재할 수 없음을 이야기 합니다. 또한, 정상적인 관리를 위해서는 해당 IP로 접근이 가능하여야 합니다. 추후 이를 개선할 예정이지만 현재는 Agent를 설치할 때 이를 확실히 인지하고 있어야 합니다. 예를 들어 docker 이미지를 실행할 경우 도커는 이미지를 위해 가상의 NIC를 구축하여 내부에서만 사용하는 별도의 IP를 할당합니다. 이 IP로는 외부에서 접근할 수 없기 때문에 각별히 신경을 써야 합니다.)

6.4. Installing Tool
CoconutTool 폴더를 운영하는 httpd의 root 혹은 당신이 원하는 하위 폴더에 복사 하세요.
CoconutTool/ajax/ control_box.html의 244line에 선언된 ipManager의 값을 설정한 Manager 주소로 변경하여 사용하시기 바랍니다.


* docker상에서 작동 시 주의 사항
 docker로 가동 시 가상 ip를 할당받게 되며, 이 ip는 외부에서 접근 불가능한 IP입니다. 현재 Coconut을 정상가동 하기 위해서는 docker run 시 --net=host 옵션을 사용하여 실행하시기 바랍니다. 이 옵션은 실행될 컨테이너의 eth0 interface에 host의 eth0가 매핑됩니다.


 
