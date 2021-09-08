import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { message } from 'antd';
import './style.less';

// 图片转base64,用于显示预览
function getBase64(img: File, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// 选择图片验证
function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传jpg或png图片！');
  }
  const isLt2M = file.size / 1024 / 1024 < 8;
  if (!isLt2M) {
    message.error('图片必须小于 8MB!');
  }
  return isJpgOrPng && isLt2M;
}

export default function ImageUpload(props: {
  upload: (files: File[]) => void, // 文件上传方法
  max?: number, // 最大数量
  style: React.CSSProperties // 样式
  type: 'avatar' | 'banner',
  initialValue?: string, // 初始banner路径
}) {
  const [imgUrl, setImgUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files as FileList;
    const fs = [];
    for(let i = 0; i < fileList?.length; i++) {
      fs.push(fileList[i]);
    }
    if(fs.length > 0){
      getBase64(fs[0], (url: string) => {
        setImgUrl(url);
      });
      setFiles(fs);
    }
  }

  useEffect(() => {
    setImgUrl(props.initialValue || '');
  }, [props.initialValue]);

  useEffect(() => {
    // files数组变化则开启上传动作
    if(files.length > 0 && beforeUpload(files[0])) {
      // 满足上传条件
      props.upload(files);
    }
  }, [files]);
  
  return (
    <div className='upload' style={props.style}>
      <div className={`${props.type === 'banner' ? 'upload_preview' : 'upload_preview avatar'}`}>
        {/* 将input绝对定位，设为透明，置于样式表层，下面放置样式 */}
        {
          imgUrl.length > 0 ? 
            <img src={imgUrl} alt='预览' style={{width: '100%'}}  /> : 
            <div className='upload_add' onClick={() => {
              fileRef.current?.click();
            }}>
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27154" width="48" height="48"><path d="M962.2333 454.827517h-393.060817v-393.060817c0-32.159521-26.033898-58.703888-58.703889-58.703888-32.159521 0-58.703888 26.033898-58.703888 58.703888v393.060817h-393.060818C26.544367 454.827517 0 480.861416 0 513.531406c0 32.159521 26.033898 58.703888 58.703888 58.703888h393.060818v393.060818c0 32.159521 26.033898 58.703888 58.703888 58.703888 32.159521 0 58.703888-26.033898 58.703889-58.703888v-393.060818h393.060817c32.159521 0 58.703888-26.033898 58.703888-58.703888s-26.544367-58.703888-58.703888-58.703889z m0 0" p-id="27155"></path><path d="M962.2333 451.764706h-393.060817v-393.060818C569.172483 26.544367 542.628116 0 510.468594 0S451.764706 26.033898 451.764706 58.703888v393.060818h-393.060818C26.544367 451.764706 0 477.798604 0 510.468594c0 32.159521 26.033898 58.703888 58.703888 58.703889h393.060818v393.060817c0 32.159521 26.033898 58.703888 58.703888 58.703888 32.159521 0 58.703888-26.033898 58.703889-58.703888v-393.060817h393.060817c32.159521 0 58.703888-26.033898 58.703888-58.703889s-26.544367-58.703888-58.703888-58.703888z m0 0" p-id="27156"></path></svg>
            </div>
        }
      </div>
      <div 
        className='upload_btn'
        onClick={() => {
          fileRef.current?.click();
        }}
        > 
        {
          props.type === 'avatar' ?
            <svg className="icon" viewBox="0 0 1137 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15793" width="32" height="32"><path d="M568.888889 359.537778c-122.88 0-223.004444 100.124444-223.004445 223.004444s100.124444 223.004444 223.004445 223.004445 223.004444-100.124444 223.004444-223.004445-100.124444-223.004444-223.004444-223.004444z m0 393.671111c-95.573333 0-172.942222-79.644444-172.942222-175.217778s79.644444-172.942222 175.217777-172.942222 175.217778 77.368889 175.217778 175.217778c-2.275556 95.573333-81.92 172.942222-177.493333 172.942222z" p-id="15794"></path><path d="M1001.244444 191.146667h-100.124444c-31.857778 0-63.715556-15.928889-79.644444-45.511111l-45.511112-77.368889c-22.755556-43.235556-68.266667-68.266667-118.328888-68.266667h-175.217778C432.355556 0 386.844444 25.031111 361.813333 68.266667l-45.511111 77.368889c-15.928889 27.306667-45.511111 45.511111-79.644444 45.511111H136.533333c-36.408889 0-70.542222 13.653333-95.573333 38.684444S0 288.995556 0 325.404444c0 186.595556 0 370.915556 2.275556 555.235556 0 36.408889 13.653333 70.542222 40.96 95.573333s61.44 38.684444 95.573333 38.684445H773.688889c11.377778 0 22.755556-9.102222 22.755555-22.755556 0-11.377778-9.102222-22.755556-22.755555-22.755555H136.533333c-50.062222 0-91.022222-40.96-91.022222-91.022223V325.404444c0-50.062222 40.96-88.746667 91.022222-91.022222h95.573334c50.062222 2.275556 95.573333-25.031111 118.328889-68.266666l45.511111-77.368889c15.928889-27.306667 47.786667-45.511111 79.644444-45.511111h175.217778c31.857778 0 63.715556 15.928889 79.644444 45.511111l45.511111 77.368889c25.031111 43.235556 70.542222 68.266667 118.328889 68.266666h100.124445c50.062222 0 91.022222 40.96 91.022222 91.022222v325.404445c-2.275556 9.102222 0 20.48 9.102222 27.306667s20.48 6.826667 29.582222 0 11.377778-18.204444 9.102223-27.306667V325.404444c0-36.408889-13.653333-70.542222-40.96-95.573333s-56.888889-40.96-91.022223-38.684444z" p-id="15795"></path><path d="M1115.022222 839.68h-111.502222V728.177778c0-11.377778-9.102222-22.755556-22.755556-22.755556-11.377778 0-22.755556 9.102222-22.755555 22.755556v111.502222h-111.502222c-11.377778 0-22.755556 9.102222-22.755556 22.755556 0 11.377778 9.102222 22.755556 22.755556 22.755555h111.502222v111.502222c0 11.377778 9.102222 22.755556 22.755555 22.755556 11.377778 0 22.755556-9.102222 22.755556-22.755556v-111.502222H1115.022222c11.377778 0 22.755556-9.102222 22.755556-22.755555-2.275556-11.377778-11.377778-22.755556-22.755556-22.755556z" p-id="15796"></path></svg> :
            <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23578" width="32" height="32"><path d="M982.7 758.4h-72.4V688c0-19.4-16.2-35.2-36.2-35.2-20 0-36.2 15.8-36.2 35.2v70.4h-72.4c-20 0-36.2 15.8-36.2 35.2s16.2 35.2 36.2 35.2h72.4v70.4c0 19.4 16.2 35.2 36.2 35.2 20 0 36.2-15.8 36.2-35.2v-70.4h72.4c20 0 36.2-15.8 36.2-35.2s-16.2-35.2-36.2-35.2zM729.2 336c0 19.4-16.2 35.2-36.2 35.2-20 0-36.2-15.8-36.2-35.2s16.2-35.2 36.2-35.2c20 0 36.2 15.8 36.2 35.2z m-144.8 0c0 58.2 48.7 105.6 108.6 105.6 59.9 0 108.6-47.4 108.6-105.6S752.9 230.4 693 230.4c-59.9 0-108.6 47.4-108.6 105.6z m159.3 248.1L617 491.8c-19.2-14-46-14-65.2 0l-111.5 81.3-148.7-115.7c-18.6-14.5-44.4-15.6-64.3-2.6L77.5 552.7V160H874v387.2c0 19.4 16.2 35.2 36.2 35.2 20 0 36.2-15.8 36.2-35.2V157c0-37.2-31.1-67.4-69.4-67.4H74.5c-38.3 0-69.4 30.3-69.4 67.4v639.5c0 37.2 31.1 67.4 69.4 67.4h546.1c20 0 36.2-15.8 36.2-35.2 0-19.4-16.2-35.2-36.2-35.2H77.5v-156l179.2-117.1 182.2 141.7L584.4 556l115.8 84.5c16.1 11.7 38.7 8.5 50.7-7 12-15.6 8.8-37.7-7.2-49.4z" p-id="23579"></path></svg>
        } 
      </div>
      <input 
        ref={fileRef}
        type="file" 
        name="file"
        // 目前只能上传一张图片
        // multiple={(props.max && props.max > 1) ? true : false}
        style={{width: '0px', height: '0px', visibility: 'hidden'}}
        accept={'.png, .jpg, .jpeg'} 
        onChange={handleChange} />
    </div>
  )
}