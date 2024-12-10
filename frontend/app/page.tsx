'use client';

import { useState, useRef } from 'react';
import { Layout, Row, Col, Card, Select, Input, Button, Upload } from 'antd';

const { Header, Content, Footer } = Layout;

type SourceInfo = {
    file?: File;       // 동영상 파일
    url?: string;      // 카메라 URL
};

export default function HomePage() {
    const [sourceType, setSourceType] = useState<'video'|'camera'>('video');
    const [sources, setSources] = useState<SourceInfo[]>([]);

    const [showVideos, setShowVideos] = useState(false);

    const handleAddSource = () => {
        setSources(prev => [...prev, {}]);
    }

    const handleChangeVideoFile = (index: number, file: File|undefined) => {
        const newSources = [...sources];
        if (file) {
            newSources[index] = { file };
        } else {
            newSources[index] = {};
        }
        setSources(newSources);
    }

    const handleChangeCameraUrl = (index: number, value: string) => {
        const newSources = [...sources];
        newSources[index] = { url: value };
        setSources(newSources);
    }

    const handleStart = () => {
        if (sources.length === 0) {
            alert("소스를 하나 이상 추가해주세요.");
            return;
        }

        // file 유효성 체크 (동영상 타입인데 파일 없는 경우)
        if (sourceType === 'video') {
            for (const src of sources) {
                if (!src.file) {
                    alert("동영상 파일을 모두 선택해주세요.");
                    return;
                }
            }
        } else {
            // camera 인데 url 비어있는 경우
            for (const src of sources) {
                if (!src.url || src.url.trim() === "") {
                    alert("카메라 URL을 모두 입력해주세요.");
                    return;
                }
            }
        }

        setShowVideos(true);
    }

    const handleGoBack = () => {
        setShowVideos(false);
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ color: '#fff', fontSize: '20px' }}>실시간 영상 처리 데모</Header>
            <Content style={{ padding: '20px' }}>
                {!showVideos && (
                    <Card title="설정" bordered={true} style={{ marginBottom: '20px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <span style={{ marginRight: '10px' }}>소스 종류 선택:</span>
                            <Select
                                value={sourceType}
                                onChange={(val) => {
                                    setSourceType(val);
                                    setSources([]); // 타입 변경 시 소스 초기화
                                }}
                                style={{ width: 200 }}
                                options={[
                                    { label: "동영상", value: "video" },
                                    { label: "카메라", value: "camera" },
                                ]}
                            />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ marginBottom: '5px' }}>
                                소스 입력 ({sourceType === 'video' ? "동영상 파일 업로드" : "카메라 URL"}):
                            </div>
                            {sources.map((src, i) => (
                                <div key={i} style={{ marginBottom: '5px' }}>
                                    {sourceType === 'video' ? (
                                        // 동영상 파일 업로드
                                        <Input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                handleChangeVideoFile(i, file);
                                            }}
                                            style={{ width: 400, display: 'block' }}
                                        />
                                    ) : (
                                        // 카메라 URL 입력
                                        <Input
                                            placeholder="카메라 스트림 URL"
                                            value={src.url || ""}
                                            onChange={(e)=>handleChangeCameraUrl(i, e.target.value)}
                                            style={{ width: 400, display: 'block' }}
                                        />
                                    )}
                                </div>
                            ))}
                            <Button onClick={handleAddSource} type="dashed" style={{ marginTop: '5px' }}>+ 소스 추가</Button>
                        </div>

                        <Button type="primary" onClick={handleStart}>시작</Button>
                    </Card>
                )}

                {showVideos && (
                    <Card title="영상 영역" bordered={true} extra={<Button onClick={handleGoBack}>뒤로가기</Button>}>
                        <Row gutter={[16,16]}>
                            {sources.map((src, i) => (
                                <Col key={i} span={12}>
                                    <Card bordered={true} style={{ textAlign: 'center' }}>
                                        <div style={{ marginBottom: '10px', color: '#999' }}>
                                            {sourceType === 'video' ? "동영상 소스" : "카메라 소스"} #{i+1}
                                        </div>
                                        {sourceType === 'video' && src.file ? (
                                            // 로컬 파일을 로드하여 video로 재생
                                            <video
                                                src={URL.createObjectURL(src.file)}
                                                controls
                                                style={{ maxWidth: '100%', background: '#000' }}
                                            />
                                        ) : (
                                            // 카메라 소스(일단 placeholder, 실제는 rtsp->webrtc 변환 등 필요)
                                            <img
                                                src="https://via.placeholder.com/400x300?text=Camera+Stream"
                                                alt="camera stream"
                                                style={{ maxWidth: '100%' }}
                                            />
                                        )}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                )}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                &copy; 2024 My Video App
            </Footer>
        </Layout>
    );
}