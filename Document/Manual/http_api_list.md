###Tool  ->  Manager
|기능	|API	|
|:-----------|------------:|
|등록된 서버 전체 리스트를 요청합니다.			|/srv_list |
|특정 서버의 정보를 요청합니다.					|/srv_info:uid(agent unique index) |
|특정 서버의 모든 프로세스 리스트를 요청합니다. 	|/srv_ps_list:ip(agent ip. Later it'll be changed to "uid". ) |
|특정 서버에서 관리중인 프로세스를 요청합니다. 	|/srv_registed_app_list: uid |
|특정 서버에 관리할 프로세스를 등록합니다.		|/srv_regist_app_update: uid, list(string what is consist of "process name" and  "|" and  "args" ) |
|Redis와 Manager에서 특정 서버의 정보를 삭제시킵니다.	|/srv_remove: uid, arrIdx(array index for managing agent list on Tool) |
|특정 서버에 실시간 정보를 요청합니다.			|/srv_getrtinfo: uid, arrIdx |
|원격 저장소에서 파일을 다운로드하도록 요청합니다.		|/dist_repo_update: target_path(local path on Agent), dist_repo_path(an address of the remote repository), servers(agent unique index list for patching from the remote repository) |
|지정한 서버들에 파일을 전송합니다.				|/file_upload: target_path(local path on Agent), servers |
|특정 서버의 Nick을 변경합니다.					|/front_modify_nick: uid, nick |
|특정 서버의 Group명을 변경합니다.		 		|/front_modify_group: uid, nick |
|지정한 프로세스의 시작을 요청합니다.			|/app_start: ip, cmd(process name), args (process args) |
|지정한 프로세스의 중지를 요청합니다.			|/app_stop: ip, pid (process id) |
|지정한 프로세스의 재시작을 요청합니다.			|/app_restart: ip, pid, cmd, args |


###Agent  ->  Manager
|기능	|API	|
|:-----------|------------:|
|Manager에 실시간 정보를 전송합니다.						|/agent_updateinfo: uid, uptime, cpuload, apps, freemem |
|Manager에 처음 접속시 자신의 모든 정보를 전송합니다.	|/agent_handshake: uid, hostname. platform, totalmen, cpucount |


###Tool  ->  Manager (RPC)
|기능	|API	|
|:-----------|------------:|
|로그인을 시도합니다. 			|login: [0] : id [1] : pw |
|특정 서버로 연결을 시도합니다. 	|connect: [0] : ip |
|현재 어떤 계정으로 접속했으며, 어떤 서버와 연결이 되어 있는지 확인을 요청합니다. |whoru: - |
|pwd | |
|ls/dir | |
|cd | |
|curl | |
|mkdir | |
|rmdir | |
|del | |
|rm | |
|tail | |
|find | |
|svn | |
