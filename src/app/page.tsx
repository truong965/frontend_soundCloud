import AppFooter from '@/components/footer/app.footer';
import MainSlider from '@/components/main/main.slider';
import { sendRequest } from '@/utils/api';
import { Category } from '@mui/icons-material';
import { Container } from '@mui/material';
import * as React from 'react';
export default async function HomePage() {
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10
    }
  });
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10
    }
  });
  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10
    }
  });
  return (
    <Container>
      <MainSlider
        data={chills?.data ? chills.data : []}
        title="Top Chill Tracks"
      />
      <MainSlider
        data={workouts?.data ? workouts.data : []}
        title="Top Workout Tracks" />
      <MainSlider
        data={party?.data ? party.data : []}
        title="Top Party Tracks" />

    </Container>
  );
}
