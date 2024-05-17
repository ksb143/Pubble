// // 1. react 관련
// import React, { useState, useEffect } from 'react';
// // 2. library
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Schema, z } from 'zod';
// // 3. api
// import { addRequirement } from '@/apis/project';
// // 4. store
// // 5. components
// import { Select } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import {
//   DialogTitle,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTrigger,
// } from '@/components/ui/dialog';

// interface RequirementAddModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const candidataArray = [
//   { EID: 'SSAFY1001', name: '최지원' },
//   { EID: 'SSAFY1002', name: '심규영' },
//   { EID: 'SSAFY1003', name: '김수빈' },
//   { EID: 'SSAFY1004', name: '문수민' },
//   { EID: 'SSAFY1005', name: '김효주' },
//   { EID: 'SSAFY1006', name: '장준영' },
// ];

// const schema = z.object({
//   title: z.string().min(1, '이름은 필수 입력사항입니다.'),
//   code: z.string().min(1, 'CODE는 필수 입력사항입니다.'),
//   detail: z.string().min(1, '상세설명은 필수 입력사항입니다.'),
//   managers: z
//     .array(z.string())
//     .min(1, '적어도 한 명의 담당자를 선택해야 합니다.'),
// });

// const RequirementAddModal = ({ isOpen, onClose }: RequirementAddModalProps) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       managers: [],
//     },
//   });
//   const [title, setTitle] = useState('');
//   const [code, setCode] = useState('');
//   const [participant, setParticipant] = useState('');
//   const [startAt, setStartAt] = useState('');
//   const [endAt, setEndAt] = useState('');

//   const handleAddRequirement = async () => {
//     const participantsArray = participant.split(',').map((part) => part.trim());
//     console.log('api 호출시작');
//     try {
//       await addProject(title, code, participantsArray, startAt, endAt);
//       console.log('api 호출 성공');
//       onClose(); // 요구사항 생성 후 모달 닫기
//     } catch (error) {
//       console.error('api 호출 실패', error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogTrigger asChild></DialogTrigger>
//       <DialogContent className='sm:max-w-[425px]'>
//         <DialogHeader>
//           <DialogTitle>요구사항 생성</DialogTitle>
//         </DialogHeader>
//         <div className='grid gap-4 py-4'>
//           <div className='grid grid-cols-4 items-center gap-4'>
//             <Label htmlFor='requirementTitle' className='text-right'>
//               이름
//             </Label>
//             <Input
//               id='requirementTitle'
//               placeholder='ex) 홈페이지 로그인 화면 UI'
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className='col-span-3'
//             />
//           </div>
//           <div className='grid grid-cols-4 items-center gap-4'>
//             <Label htmlFor='requirementCode' className='text-right'>
//               CODE
//             </Label>
//             <Input
//               id='requirementCode'
//               placeholder='ex) OLD-001'
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               className='col-span-3'
//             />
//           </div>
//           <div className='grid grid-cols-4 items-center gap-4'>
//             <Label htmlFor='requirementDetail' className='text-right'>
//               상세설명
//             </Label>
//             <Input
//               id='requirementDetail'
//               placeholder='ex) 로그인 화면에 파란색 로그인 버튼을 추가하십시오.'
//               value={detail}
//               onChange={(e) => setDetail(e.target.value)}
//               className='col-span-3'
//             />
//           </div>
//           <div className='grid grid-cols-4 items-center gap-4'>
//             <Label htmlFor='requirementManager' className='text-right'>
//               담당자
//             </Label>
//             <Input
//               id='requirementManager'
//               type='checkbox'
//               value={manager}
//               onChange={(e) => setManager(e.target.value)}
//               className='col-span-3'
//             />
//           </div>
//           <DialogFooter>
//             <Button onClick={handleAddRequirement}>생성</Button>
//             <Button onClick={onClose}>취소</Button>
//           </DialogFooter>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RequirementAddModal;
