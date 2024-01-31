import CreateAccount from '@/components/Signup/CreateAccount';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PersonaliseAccount from '@/components/Signup/PersonaliseAccount';
import VerifyEmail from '@/components/Signup/VerifyEmail';

function Signup() {
  const [swiper, setSwiperInstance] = useState(null);

  return (
    <Swiper
      autoHeight
      onSwiper={setSwiperInstance}
      pagination={{
        type: 'progressbar'
      }}
      modules={[Pagination]}
      allowTouchMove={false}>
      <SwiperSlide>
        <CreateAccount swiper={swiper} />
      </SwiperSlide>
      <SwiperSlide>
        <PersonaliseAccount swiper={swiper} />
      </SwiperSlide>
      <SwiperSlide>
        <VerifyEmail swiper={swiper} />
      </SwiperSlide>
    </Swiper>
  );
}

Signup.getLayout = (page) => page;
Signup.guestGuard = true;

export default Signup;
