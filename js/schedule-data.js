
/* ========================================
   INVITED V2.0
   CENTRAL SCHEDULE DATA
======================================== */

window.INVITED_SCHEDULE = {

    timezone: 'Asia/Seoul',

    /* ====================================
       01. 일정 유형
    ==================================== */

    categories: {

        scuba: {
            label: '스쿠버다이빙 교육',
            color: '#3977B9'
        },

        freediving: {
            label: '프리다이빙 교육',
            color: '#289A9A'
        },

        domestic: {
            label: '국내 투어',
            color: '#C48B42'
        },

        overseas: {
            label: '해외 투어',
            color: '#8064B5'
        },

        community: {
            label: '커뮤니티',
            color: '#439B68'
        },

        promotion: {
            label: '이벤트 및 프로모션',
            color: '#D35F5F'
        }

    },

    /* ====================================
       02. 모집 상태
    ==================================== */

    statuses: {

        scheduled: '모집 예정',

        open: '모집 중',

        soon: '마감 임박',

        closed: '모집 마감',

        completed: '종료',

        cancelled: '취소'

    },

    /* ====================================
       03. 공개 일정
    ==================================== */

    events: [

        /* OPEN WATER 1+1 */

        {
            id: 'openwater-promotion-2026',

            category: 'promotion',

            title: '오픈워터 1+1',

            subtitle: '우리의 첫 바다.',

            start: '2026-12-01',

            end: '2026-12-31',

            description:
                '2인 교육비 500,000원 · 선착순 10팀',

            price: 500000,

            priceUnit: '2인 기준',

            capacity: 20,

            maxTeams: 10,

            reservedTeams: null,

            included: [
                '교재비'
            ],

            excluded: [
                '자격증 발급비',
                '시설 이용료',
                '장비 렌탈비',
                '해양 실습비'
            ],

            status: 'scheduled',

            recruitmentStart: '2026-12-01',

            recruitmentEnd: '2026-12-31',

            published: true,

            link: 'index.html#promotion',

            contact:
                'https://pf.kakao.com/_bCxexaX'
        },


        /* CHRISTMAS IN CEBU */

        {
            id: 'cebu-2026',

            category: 'overseas',

            title: 'Christmas in Cebu',

            subtitle: '세부 크리스마스 다이빙 투어',

            start: '2026-12-22',

            end: '2026-12-27',

            location: '필리핀 세부',

            description:
                '5박 6일 · 다이빙 총 9회',

            price: null,

            priceUnit: '별도 문의',

            minimum: 4,

            capacity: 6,

            status: 'open',

            recruitmentStart: null,

            recruitmentEnd: null,

            published: true,

            link: 'tour.html#cebu-2026',

            contact:
                'https://pf.kakao.com/_bCxexaX'
        }

    ]

};


/* ========================================
   04. 공통 일정 관리 기능
======================================== */

window.INVITED_SCHEDULE_UTILS = {

    /* 한국 기준 현재 날짜 */

    getToday() {

        const parts = new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        ).formatToParts(new Date());

        const getPart = type =>
            parts.find(p => p.type === type).value;

        return [
            getPart('year'),
            getPart('month'),
            getPart('day')
        ].join('-');

    },


    /* 일정 상태 자동 판별 */

    getStatus(event) {

        const today = this.getToday();

        if (event.status === 'cancelled') {
            return 'cancelled';
        }

        if (
            event.status === 'completed' ||
            today > event.end
        ) {
            return 'completed';
        }

        if (event.status === 'closed') {
            return 'closed';
        }

        if (
            event.maxTeams != null &&
            event.reservedTeams != null &&
            event.reservedTeams >= event.maxTeams
        ) {
            return 'closed';
        }

        if (
            event.recruitmentStart &&
            today < event.recruitmentStart
        ) {
            return 'scheduled';
        }

        if (
            event.recruitmentEnd &&
            today > event.recruitmentEnd
        ) {
            return 'closed';
        }

        if (
            ['domestic', 'overseas'].includes(
                event.category
            ) &&
            today >= event.start
        ) {
            return 'closed';
        }

        if (
            event.status === 'scheduled' &&
            event.recruitmentStart &&
            today >= event.recruitmentStart
        ) {
            return 'open';
        }

        return event.status;

    },


    /* 공개 일정만 불러오기 */

    getEvents(category = 'all') {

        return window.INVITED_SCHEDULE.events

            .filter(event => event.published)

            .filter(event =>
                category === 'all' ||
                event.category === category
            )

            .map(event => ({
                ...event,

                currentStatus: this.getStatus(event)

            }))

            .sort((a, b) =>
                a.start.localeCompare(b.start)
            );

    },


    /* 특정 날짜의 일정 불러오기 */

    getEventsByDate(date) {

        return this.getEvents().filter(event =>

            event.start <= date &&
            event.end >= date

        );

    },


    /* 특정 월의 일정 불러오기 */

    getEventsByMonth(year, month) {

        const monthString = String(month)
            .padStart(2, '0');

        const first =
            `${year}-${monthString}-01`;

        const lastDay = new Date(
            year, month, 0
        ).getDate();

        const last =
            `${year}-${monthString}-${lastDay}`;

        return this.getEvents().filter(event =>

            event.start <= last &&
            event.end >= first

        );

    },


    /* 모집 중인 일정 */

    getOpenEvents() {

        return this.getEvents().filter(event =>

            ['open', 'soon'].includes(
                event.currentStatus
            )

        );

    },


    /* 예정된 일정 */

    getUpcomingEvents() {

        const today = this.getToday();

        return this.getEvents().filter(event =>

            event.end >= today &&
            event.currentStatus !== 'cancelled' &&
            event.currentStatus !== 'completed'

        );

    }

};
