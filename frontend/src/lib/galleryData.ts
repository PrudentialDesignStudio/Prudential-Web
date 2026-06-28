// Static gallery data — all images and videos are Cloudinary URLs, no backend needed.
export interface GalleryItem {
  url: string;
  caption: string | null;
  type: 'image' | 'video';
  category: string;
  display_order: number;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960940/FB_IMG_1711223507801_hxuk9u.jpg",
    "caption": "Anti-Bullying Day assembly",
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 1
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960939/FB_IMG_1711223533136_ycxafo.jpg",
    "caption": "Students rallying against bullying",
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 2
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961029/FB_IMG_1711223485623_rmvyri.jpg",
    "caption": "Student with anti-bullying poster",
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 4
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973066/FB_IMG_1711223514887_arvb14.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 14
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973106/FB_IMG_1711223519470_hf023y.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 15
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973141/FB_IMG_1711223483148_qreodr.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 16
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973185/FB_IMG_1711223495706_frxujj.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 17
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973226/FB_IMG_1711223498544_pcgmg0.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 18
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973279/FB_IMG_1711223503038_adf8rq.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 19
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973318/FB_IMG_1711223510192_qsimum.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 20
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973352/FB_IMG_1711223526337_pn249s.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 21
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973387/FB_IMG_1711223538586_yeqlmq.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 22
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781973013/FB_IMG_1711223488777_kyvlwy.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Bullying Campaign",
    "display_order": 23
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781961335/FB_IMG_1711222277144_flbanx.jpg",
    "caption": "Anti-Drugs Abuse Campaign group",
    "type": "image",
    "category": "Anti-Drugs Abuse Campaign",
    "display_order": 1
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781971909/FB_IMG_1711222285990_bk7vbe.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Drugs Abuse Campaign",
    "display_order": 6
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781971957/FB_IMG_1711222291053_s7ryry.jpg",
    "caption": null,
    "type": "image",
    "category": "Anti-Drugs Abuse Campaign",
    "display_order": 7
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782147277/WhatsApp_Video_2026-06-22_at_4.52.33_PM_b8uycr.mp4",
    "caption": null,
    "type": "video",
    "category": "Art & Music Fiesta",
    "display_order": 13
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782147279/WhatsApp_Video_2026-06-22_at_4.52.51_PM_mezmm7.mp4",
    "caption": null,
    "type": "video",
    "category": "Art & Music Fiesta",
    "display_order": 14
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782147263/WhatsApp_Video_2026-06-22_at_4.52.32_PM_vatvzo.mp4",
    "caption": null,
    "type": "video",
    "category": "Art & Music Fiesta",
    "display_order": 15
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147258/WhatsApp_Image_2026-06-22_at_4.52.29_PM_2_aotbjl.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 62
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147258/WhatsApp_Image_2026-06-22_at_4.52.29_PM_3_zclfek.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 63
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147258/WhatsApp_Image_2026-06-22_at_4.52.29_PM_4_rgwatl.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 64
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147259/WhatsApp_Image_2026-06-22_at_4.52.29_PM_bf1mb1.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 65
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147259/WhatsApp_Image_2026-06-22_at_4.52.31_PM_1_fo3gsv.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 66
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147260/WhatsApp_Image_2026-06-22_at_4.52.31_PM_3_nbukn9.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 67
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147260/WhatsApp_Image_2026-06-22_at_4.52.31_PM_p3wgx0.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 68
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147259/WhatsApp_Image_2026-06-22_at_4.52.31_PM_2_rgjto0.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 69
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147261/WhatsApp_Image_2026-06-22_at_4.52.32_PM_gfut2t.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 70
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147261/WhatsApp_Image_2026-06-22_at_4.52.28_PM_us1mrq.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 71
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147261/WhatsApp_Image_2026-06-22_at_4.52.29_PM_1_i99d1l.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 72
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147274/WhatsApp_Image_2026-06-22_at_4.52.30_PM_2_qtlswx.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 73
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147274/WhatsApp_Image_2026-06-22_at_4.52.30_PM_1_zsnnqo.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 74
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147274/WhatsApp_Image_2026-06-22_at_4.52.30_PM_jhqjua.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 75
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.14_PM_hfqq8v.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 76
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.13_PM_hgks6l.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 77
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.14_PM_1_j9bla4.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 78
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781974172/download_1_slkr7a.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 79
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065580/WhatsApp_Image_2026-06-21_at_1.35.13_PM_1_go2avm.jpg",
    "caption": null,
    "type": "image",
    "category": "Art & Music Fiesta",
    "display_order": 80
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066616/VID-20260621-WA0010_1_sttzyz.mp4",
    "caption": null,
    "type": "video",
    "category": "Children's Day ",
    "display_order": 5
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066617/VID-20260621-WA0009_2_s1wtec.mp4",
    "caption": null,
    "type": "video",
    "category": "Children's Day ",
    "display_order": 6
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066621/VID-20260621-WA0011_1_b9rxa4.mp4",
    "caption": null,
    "type": "video",
    "category": "Children's Day ",
    "display_order": 7
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782194530/WhatsApp_Video_2026-06-23_at_6.58.44_AM_vteszp.mp4",
    "caption": null,
    "type": "video",
    "category": "Football Club ",
    "display_order": 23
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782194532/WhatsApp_Video_2026-06-23_at_6.58.41_AM_yokde5.mp4",
    "caption": null,
    "type": "video",
    "category": "Football Club ",
    "display_order": 24
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961442/VID-20250713-WA0003_2_okivzk.mp4",
    "caption": "Graduation \u2014 student dance performance",
    "type": "video",
    "category": "Graduation",
    "display_order": 1
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961422/VID-20250713-WA0004_2_teg9t8.mp4",
    "caption": "Graduation \u2014 cap & gown stage line-up",
    "type": "video",
    "category": "Graduation",
    "display_order": 2
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961450/VID-20250713-WA0024_2_doiyaz.mp4",
    "caption": "Graduation \u2014 second performance number",
    "type": "video",
    "category": "Graduation",
    "display_order": 3
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1781961426/VID-20250713-WA0025_2_woaooh.mp4",
    "caption": "Graduation \u2014 gowns, wide angle",
    "type": "video",
    "category": "Graduation",
    "display_order": 4
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.41_PM_p249l4.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 53
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.43_PM_xsdga9.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 54
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.41_PM_1_pycntb.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 55
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.40_PM_db5j7l.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 56
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.42_PM_1_bukgrl.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 57
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147017/WhatsApp_Image_2026-06-22_at_4.49.42_PM_2_czc32i.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 58
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147018/WhatsApp_Image_2026-06-22_at_4.49.42_PM_3_iyaqd2.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 59
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147018/WhatsApp_Image_2026-06-22_at_4.49.43_PM_1_rc18tr.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 60
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782147018/WhatsApp_Image_2026-06-22_at_4.49.42_PM_yqe2fo.jpg",
    "caption": null,
    "type": "image",
    "category": "Independence Day ",
    "display_order": 61
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066789/VID-20260621-WA0013_zz5qoh.mp4",
    "caption": null,
    "type": "video",
    "category": "Inter-house Sport Competition",
    "display_order": 8
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066808/VID-20260621-WA0012_vgdymz.mp4",
    "caption": null,
    "type": "video",
    "category": "Inter-house Sport Competition",
    "display_order": 9
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066828/VID-20260621-WA0015_ash1jc.mp4",
    "caption": null,
    "type": "video",
    "category": "Inter-house Sport Competition",
    "display_order": 10
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066828/VID-20260621-WA0015_ash1jc.mp4",
    "caption": null,
    "type": "video",
    "category": "Inter-house Sport Competition",
    "display_order": 11
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782066834/VID-20260621-WA0014_dlufcp.mp4",
    "caption": null,
    "type": "video",
    "category": "Inter-house Sport Competition",
    "display_order": 12
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782019279/IMG_20230626_093328_428_xgqoc1.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 28
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018827/IMG_20230626_093202_834_w1q1wg.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 29
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018793/IMG_20230626_095247_385_yl6evg.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 30
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018935/IMG_20230626_095318_916_r4puna.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 31
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782018883/IMG_20230626_095137_905_rrqt0g.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 32
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782019481/IMG_20230626_095226_072_etkbdd.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 33
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782019699/IMG_20230626_095357_538_dt8rzi.jpg",
    "caption": null,
    "type": "image",
    "category": "Nursery Fruit Day",
    "display_order": 34
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960656/FB_IMG_1711223575509_d9s0wk.jpg",
    "caption": "Prefects' Investiture \u2014 full group",
    "type": "image",
    "category": "School Prefects",
    "display_order": 1
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960770/FB_IMG_1711223599976_ewmpsp.jpg",
    "caption": "Prefects' Investiture \u2014 formal group portrait",
    "type": "image",
    "category": "School Prefects",
    "display_order": 2
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960727/FB_IMG_1711223580230_cxarkj.jpg",
    "caption": "Investiture handshake moment",
    "type": "image",
    "category": "School Prefects",
    "display_order": 3
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960728/FB_IMG_1711223573522_nmp7sl.jpg",
    "caption": "Sport Prefect",
    "type": "image",
    "category": "School Prefects",
    "display_order": 4
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781960726/FB_IMG_1711223582182_fh7puw.jpg",
    "caption": "Regulatory Prefect",
    "type": "image",
    "category": "School Prefects",
    "display_order": 5
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972099/FB_IMG_1711223563716_pjahzw.jpg",
    "caption": "Labour Prefect",
    "type": "image",
    "category": "School Prefects",
    "display_order": 8
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972179/FB_IMG_1711223566345_a3brct.jpg",
    "caption": "Social Prefect",
    "type": "image",
    "category": "School Prefects",
    "display_order": 9
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972303/FB_IMG_1711223593642_n7mbvw.jpg",
    "caption": "Senior Prefect Girl",
    "type": "image",
    "category": "School Prefects",
    "display_order": 11
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972241/FB_IMG_1711223571589_tzoihe.jpg",
    "caption": "Health Prefect ",
    "type": "image",
    "category": "School Prefects",
    "display_order": 24
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1781972383/FB_IMG_1711223588107_yrl6qe.jpg",
    "caption": "Senior Prefect Boy ",
    "type": "image",
    "category": "School Prefects",
    "display_order": 26
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782191710/WhatsApp_Video_2026-06-23_at_6.07.34_AM_1_kgcgqv.mp4",
    "caption": null,
    "type": "video",
    "category": "Science Day Event ",
    "display_order": 20
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782191718/WhatsApp_Video_2026-06-23_at_6.07.17_AM_omikka.mp4",
    "caption": null,
    "type": "video",
    "category": "Science Day Event ",
    "display_order": 21
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782191723/WhatsApp_Video_2026-06-23_at_6.07.34_AM_nx9whj.mp4",
    "caption": null,
    "type": "video",
    "category": "Science Day Event ",
    "display_order": 22
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189056/WhatsApp_Image_2026-06-22_at_9.39.04_PM_1_pgucj6.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 96
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.06_PM_ixppwm.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 97
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.02_PM_lkx3uy.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 98
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.03_PM_mp22u3.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 99
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.03_PM_1_th3izo.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 100
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.06_PM_1_hechaq.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 101
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.05_PM_1_bicl0f.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 102
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189058/WhatsApp_Image_2026-06-22_at_9.39.05_PM_3_jltczy.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 103
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189058/WhatsApp_Image_2026-06-22_at_9.39.05_PM_2_epnmju.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 104
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189058/WhatsApp_Image_2026-06-22_at_9.39.04_PM_f54xik.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 105
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782189057/WhatsApp_Image_2026-06-22_at_9.39.05_PM_yju7tx.jpg",
    "caption": null,
    "type": "image",
    "category": "Science Day Event ",
    "display_order": 106
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148018/WhatsApp_Video_2026-06-22_at_5.00.34_PM_ymljpk.mp4",
    "caption": null,
    "type": "video",
    "category": "Staff Parties & Awards",
    "display_order": 16
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148020/WhatsApp_Video_2026-06-22_at_5.00.58_PM_ckhwve.mp4",
    "caption": null,
    "type": "video",
    "category": "Staff Parties & Awards",
    "display_order": 17
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148026/WhatsApp_Video_2026-06-22_at_5.00.51_PM_qcnvpr.mp4",
    "caption": null,
    "type": "video",
    "category": "Staff Parties & Awards",
    "display_order": 18
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/video/upload/v1782148030/WhatsApp_Video_2026-06-22_at_5.00.42_PM_kcjiuy.mp4",
    "caption": null,
    "type": "video",
    "category": "Staff Parties & Awards",
    "display_order": 19
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065721/IMG-20260621-WA0024_ylpvhj.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 39
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065722/IMG-20260621-WA0025_k6j9kj.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 40
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.31_PM_2_uin8ms.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 41
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065842/IMG-20260621-WA0026_vzghx1.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 42
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065723/IMG-20260621-WA0017_aofsci.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 43
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065724/IMG-20260621-WA0019_cr2exu.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 44
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065724/IMG-20260621-WA0018_kcwtce.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 45
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065725/IMG-20260621-WA0020_kut9jl.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 46
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065763/IMG-20260621-WA0027_pvlvhj.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 47
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065764/IMG-20260621-WA0028_pkf8dg.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 48
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065795/IMG-20260621-WA0029_bsgwsv.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 49
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065721/IMG-20260621-WA0023_kscvol.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 50
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065721/IMG-20260621-WA0022_zq7ta9.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 51
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782065720/IMG-20260621-WA0021_htdjcx.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 52
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.29_PM_2_u5f3ti.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 81
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.29_PM_3_rabe7j.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 82
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.29_PM_1_vlw1oe.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 83
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148011/WhatsApp_Image_2026-06-22_at_5.00.30_PM_1_fp5lze.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 84
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.30_PM_u4suij.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 85
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.30_PM_3_vh3afj.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 86
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.30_PM_2_nsj9tb.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 87
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148012/WhatsApp_Image_2026-06-22_at_5.00.31_PM_1_deymnz.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 88
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148015/WhatsApp_Image_2026-06-22_at_5.00.31_PM_v6vgut.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 89
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148014/WhatsApp_Image_2026-06-22_at_5.00.31_PM_4_mma5pz.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 90
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148015/WhatsApp_Image_2026-06-22_at_5.00.32_PM_1_bo0pmw.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 91
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148015/WhatsApp_Image_2026-06-22_at_5.00.32_PM_2_ikkyai.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 92
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148016/WhatsApp_Image_2026-06-22_at_5.00.32_PM_w78psj.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 93
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148016/WhatsApp_Image_2026-06-22_at_5.00.52_PM_iz8pvv.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 94
  },
  {
    "url": "https://res.cloudinary.com/dagt2a1w0/image/upload/v1782148017/WhatsApp_Image_2026-06-22_at_5.00.53_PM_idnmc6.jpg",
    "caption": null,
    "type": "image",
    "category": "Staff Parties & Awards",
    "display_order": 95
  }
];

export const GALLERY_CATEGORIES = [
  "Anti-Bullying Campaign",
  "Anti-Drugs Abuse Campaign",
  "Art & Music Fiesta",
  "Children's Day ",
  "Football Club ",
  "Graduation",
  "Independence Day ",
  "Inter-house Sport Competition",
  "Nursery Fruit Day",
  "School Prefects",
  "Science Day Event ",
  "Staff Parties & Awards",
];
