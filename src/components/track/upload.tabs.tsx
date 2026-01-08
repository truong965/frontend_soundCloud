'use client'

import { Container, Tabs, Tab, Box } from "@mui/material";
import * as React from 'react';
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";

interface TabPanelProps {
      children?: React.ReactNode;
      index: number;
      value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
      <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
      >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
);

interface TrackUpload {
      fileName: string;
      percent: number;
      uploadedTrackName: string;
}

const INITIAL_TRACK_UPLOAD: TrackUpload = {
      fileName: "",
      percent: 0,
      uploadedTrackName: ""
};

const UploadTabs = () => {
      const [currentTab, setCurrentTab] = React.useState(0);
      const [trackUpload, setTrackUpload] = React.useState<TrackUpload>(INITIAL_TRACK_UPLOAD);

      const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
            setCurrentTab(newValue);
      };

      // Reset state when going back to tab 1
      const handleSetTab = (value: number) => {
            if (value === 0) {
                  setTrackUpload(INITIAL_TRACK_UPLOAD);
            }
            setCurrentTab(value);
      };

      return (
            <Container
                  sx={{
                        marginTop: "100px",
                        border: "1px solid #ddd",
                        borderRadius: 1
                  }}
            >
                  <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                              <Tabs
                                    value={currentTab}
                                    onChange={handleTabChange}
                                    aria-label="upload tabs"
                              >
                                    <Tab
                                          label="Tracks"
                                          id="tab-0"
                                          aria-controls="tabpanel-0"
                                          disabled={currentTab !== 0}
                                    />
                                    <Tab
                                          label="Basic Information"
                                          id="tab-1"
                                          aria-controls="tabpanel-1"
                                          disabled={currentTab !== 1}
                                    />
                              </Tabs>
                        </Box>

                        <TabPanel value={currentTab} index={0}>
                              <Step1
                                    setValue={handleSetTab}
                                    setTrackUpload={setTrackUpload}
                                    trackUpload={trackUpload}
                              />
                        </TabPanel>

                        <TabPanel value={currentTab} index={1}>
                              <Step2
                                    trackUpload={trackUpload}
                                    setValue={handleSetTab}
                              />
                        </TabPanel>
                  </Box>
            </Container>
      );
};

export default UploadTabs;