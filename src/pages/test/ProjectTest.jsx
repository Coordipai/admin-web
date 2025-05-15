import React, { useState } from "react";
import { useAccessTokenStore } from "@store/useUserStore";

const ProjectTest = () => {
  const [projectName, setProjectName] = useState("TestProject");
  const [repoName, setRepoName] = useState("jhssong/test");
  const [startDate, setStartDate] = useState("2025-04-29T22:41");
  const [endDate, setEndDate] = useState("2025-05-29T22:41");
  const [sprintUnit, setSprintUnit] = useState(1);
  const [discordChannelId, setDiscordChannelId] = useState("123");
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState(null);

  // const URL = "http://localhost:8000";
  const URL = "https://coordipai-web-server.knuassignx.site";

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const accessToken = useAccessTokenStore.getState().accessToken;

    // 날짜를 ISO 8601 형식으로 변환
    const projectReq = {
      name: projectName,
      repo_fullname: repoName,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      sprint_unit: Number(sprintUnit),
      discord_channel_id: String(discordChannelId),
      members: [{ id: 1, role: "backend" }],
    };

    formData.append("project_req", JSON.stringify(projectReq));

    files.forEach((file) => {
      formData.append("files", file);
    });

    console.log("Create project: " + accessToken);
    try {
      const res = await fetch(URL + "/project", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Upload failed", err);
      setResponse({ error: "Upload failed" });
    }
  };

  const handleAllProjects = async () => {
    const accessToken = useAccessTokenStore.getState().accessToken;
    try {
      const res = await fetch(URL + "/project", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Upload failed", err);
      setResponse({ error: "Upload failed" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>프로젝트 생성 및 파일 업로드</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>프로젝트 이름:</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>레포 이름:</label>
          <input
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>시작 날짜:</label>
          <input
            type='datetime-local'
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>종료 날짜:</label>
          <input
            type='datetime-local'
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>스프린트 단위 (일):</label>
          <input
            type='number'
            value={sprintUnit}
            onChange={(e) => setSprintUnit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>디스코드 채널 ID:</label>
          <input
            type='number'
            value={discordChannelId}
            onChange={(e) => setDiscordChannelId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>이미지 파일 선택 (여러 개 가능):</label>
          <input type='file' multiple onChange={handleFileChange} />
        </div>
        <button type='submit'>업로드</button>
      </form>

      <button type='button' onClick={handleAllProjects}>
        불러오기
      </button>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>서버 응답:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ProjectTest;
