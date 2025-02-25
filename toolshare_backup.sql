--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    order_id integer NOT NULL,
    detail text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.history OWNER TO postgres;

--
-- Name: history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.history_id_seq OWNER TO postgres;

--
-- Name: history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.history_id_seq OWNED BY public.history.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tool_id integer NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivery_type character varying(20),
    delivery_address text,
    CONSTRAINT check_order_dates CHECK ((end_date > start_date))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    rental_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date timestamp without time zone DEFAULT now() NOT NULL,
    payment_method character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'completed'::character varying NOT NULL,
    transaction_id character varying(100),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: rentals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rentals (
    id integer NOT NULL,
    tool_id integer,
    renter_id integer,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    pickup_location text,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rentals OWNER TO postgres;

--
-- Name: rentals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rentals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rentals_id_seq OWNER TO postgres;

--
-- Name: rentals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rentals_id_seq OWNED BY public.rentals.id;


--
-- Name: support_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_requests (
    id integer NOT NULL,
    user_id integer,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(100),
    email character varying(100),
    phone character varying(20),
    address text
);


ALTER TABLE public.support_requests OWNER TO postgres;

--
-- Name: support_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.support_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_requests_id_seq OWNER TO postgres;

--
-- Name: support_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.support_requests_id_seq OWNED BY public.support_requests.id;


--
-- Name: tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tools (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    price_per_day numeric(10,2) NOT NULL,
    description text,
    image_url character varying(255),
    owner_id integer,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tools OWNER TO postgres;

--
-- Name: tools_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tools_id_seq OWNER TO postgres;

--
-- Name: tools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tools_id_seq OWNED BY public.tools.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20),
    address text,
    phone character varying(20),
    date_of_birth date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'active'::character varying,
    full_name character varying(100),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'renter'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history ALTER COLUMN id SET DEFAULT nextval('public.history_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: rentals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals ALTER COLUMN id SET DEFAULT nextval('public.rentals_id_seq'::regclass);


--
-- Name: support_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests ALTER COLUMN id SET DEFAULT nextval('public.support_requests_id_seq'::regclass);


--
-- Name: tools id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tools ALTER COLUMN id SET DEFAULT nextval('public.tools_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.history (id, user_id, order_id, detail, created_at) FROM stdin;
1	1	1	Order placed for Tool Rental	2025-02-25 22:41:24.58828
2	1	1	Payment completed	2025-02-25 22:41:24.58828
3	2	2	Order placed for Tool Rental	2025-02-25 22:41:24.58828
4	2	2	Order cancelled by user	2025-02-25 22:41:24.58828
5	3	3	Order placed for Tool Rental	2025-02-25 22:41:24.58828
6	3	3	Rental period started	2025-02-25 22:41:24.58828
7	3	3	Rental period completed	2025-02-25 22:41:24.58828
8	13	16	Rental of Power Drill for 1 days	2025-02-26 03:20:28.875489
9	13	17	Rental of Power Drill for 1 days	2025-02-26 03:34:33.260499
10	13	18	Rental of Test listing for 1 days	2025-02-26 04:57:43.464494
11	13	19	Rental of Hammer Ultimate Pro Max for 1 days	2025-02-26 05:33:18.154433
12	13	20	Rental of Hammer Ultimate Pro Max for 1 days	2025-02-26 05:34:12.350347
13	13	21	Rental of Hammer Ultimate Pro Max for 1 days	2025-02-26 05:47:05.527847
14	13	22	Rental of Hammer Ultimate Pro Max for 1 days	2025-02-26 05:50:03.460322
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, tool_id, start_date, end_date, status, created_at, delivery_type, delivery_address) FROM stdin;
2	2	3	2025-02-27 00:00:00	2025-03-02 00:00:00	pending	2025-02-25 20:35:51.434011	\N	\N
3	1	4	2025-02-23 00:00:00	2025-02-26 00:00:00	active	2025-02-25 20:35:51.434011	\N	\N
4	3	5	2025-02-20 00:00:00	2025-02-23 00:00:00	completed	2025-02-25 20:35:51.434011	\N	\N
5	2	6	2025-02-15 00:00:00	2025-02-17 00:00:00	cancelled	2025-02-25 20:35:51.434011	\N	\N
1	1	2	2025-03-26 12:00:00	2025-03-29 12:00:00	cancelled	2025-02-25 20:35:51.434011	\N	\N
7	3	3	2025-03-01 09:00:00	2025-03-10 18:00:00	active	2025-02-25 21:16:44.696866	\N	\N
8	1	5	2025-01-05 10:00:00	2025-01-07 10:00:00	completed	2025-02-25 21:16:44.696866	\N	\N
6	2	1	2025-04-15 12:00:00	2025-04-20 12:00:00	active	2025-02-25 21:16:44.696866	\N	\N
9	2	3	2025-05-12 10:00:00	2025-05-18 16:00:00	cancelled	2025-02-25 21:24:21.427199	\N	\N
10	2	3	2025-05-12 10:00:00	2025-05-18 16:00:00	cancelled	2025-02-25 22:17:43.814403	\N	\N
11	1	2	2025-02-25 17:00:00	2025-02-26 17:00:00	pending	2025-02-25 23:02:27.54718	\N	\N
12	1	3	2025-02-25 17:00:00	2025-02-26 17:00:00	pending	2025-02-25 23:36:09.313581	\N	\N
13	1	3	2025-02-25 17:00:00	2025-02-26 17:00:00	pending	2025-02-25 23:39:42.620875	\N	\N
14	1	3	2025-02-25 17:00:00	2025-02-26 17:00:00	pending	2025-02-25 23:39:49.964534	\N	\N
15	1	11	2025-02-26 17:00:00	2025-02-27 17:00:00	pending	2025-02-26 01:41:33.235047	\N	\N
16	13	11	2025-02-26 00:00:00	2025-02-27 00:00:00	completed	2025-02-26 03:20:28.568323	delivery	asdsadsads
17	13	11	2025-02-27 00:00:00	2025-03-01 17:00:00	completed	2025-02-26 03:34:33.109183	delivery	sdfdsfdf
18	13	13	2025-02-27 00:00:00	2025-02-28 00:00:00	completed	2025-02-26 04:57:43.171028	delivery	Not my house
21	13	15	2025-02-26 00:00:00	2025-02-27 00:00:00	completed	2025-02-26 05:47:05.384713	delivery	asdsadsadsa
20	13	15	2025-02-26 00:00:00	2025-02-27 00:00:00	completed	2025-02-26 05:34:12.205448	pickup	\N
19	13	15	2025-02-26 00:00:00	2025-02-27 00:00:00	completed	2025-02-26 05:33:18.002341	delivery	my home
22	13	15	2025-02-26 00:00:00	2025-02-27 00:00:00	completed	2025-02-26 05:50:03.313869	pickup	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, rental_id, amount, payment_date, payment_method, status, transaction_id, created_at) FROM stdin;
1	1	50.00	2025-02-25 21:56:03.95554	credit_card	completed	txn_123456789	2025-02-25 21:56:03.95554
2	2	75.00	2025-02-25 21:56:03.95554	paypal	completed	txn_234567890	2025-02-25 21:56:03.95554
3	3	100.00	2025-02-25 21:56:03.95554	credit_card	completed	txn_345678901	2025-02-25 21:56:03.95554
4	4	60.00	2025-02-25 21:56:03.95554	credit_card	pending	txn_456789012	2025-02-25 21:56:03.95554
5	5	120.00	2025-02-25 21:56:03.95554	bank_transfer	completed	txn_567890123	2025-02-25 21:56:03.95554
6	1	25.00	2025-02-25 21:56:03.95554	credit_card	completed	txn_678901234	2025-02-25 21:56:03.95554
7	7	15.00	2025-02-25 23:02:27.739578	credit_card	completed	demo_1740499347642	2025-02-25 23:02:27.739578
8	8	35.00	2025-02-25 23:36:09.422741	credit_card	completed	demo_1740501369374	2025-02-25 23:36:09.422741
9	9	35.00	2025-02-25 23:39:42.735899	credit_card	completed	demo_1740501582682	2025-02-25 23:39:42.735899
10	10	35.00	2025-02-25 23:39:50.090258	credit_card	completed	demo_1740501590036	2025-02-25 23:39:50.090258
11	11	25.00	2025-02-26 01:41:33.434545	credit_card	completed	demo_1740508893338	2025-02-26 01:41:33.434545
12	12	25.00	2025-02-26 03:20:28.77725	credit_card	completed	txn_1740514828671	2025-02-26 03:20:28.77725
13	13	25.00	2025-02-26 03:34:33.215582	credit_card	completed	txn_1740515673167	2025-02-26 03:34:33.215582
14	14	999.00	2025-02-26 04:57:43.363006	credit_card	completed	txn_1740520663272	2025-02-26 04:57:43.363006
15	15	20.00	2025-02-26 05:33:18.1046	credit_card	completed	txn_1740522798057	2025-02-26 05:33:18.1046
16	16	20.00	2025-02-26 05:34:12.306947	credit_card	completed	txn_1740522852259	2025-02-26 05:34:12.306947
17	17	20.00	2025-02-26 05:47:05.481326	credit_card	completed	txn_1740523625437	2025-02-26 05:47:05.481326
18	18	20.00	2025-02-26 05:50:03.412804	credit_card	completed	txn_1740523803365	2025-02-26 05:50:03.412804
\.


--
-- Data for Name: rentals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rentals (id, tool_id, renter_id, start_date, end_date, status, pickup_location, total_price, created_at) FROM stdin;
2	2	5	2024-02-10	2024-02-12	completed	654 Elm St, City	30.00	2025-02-24 06:20:39.329177
3	3	1	2024-02-20	2024-02-22	pending	123 Main St, City	70.00	2025-02-24 06:20:39.329177
4	4	5	2024-02-25	2024-02-27	pending	654 Elm St, City	90.00	2025-02-24 06:20:39.329177
1	1	1	2024-02-15	2024-02-18	cancelled	123 Main St, City	75.00	2025-02-24 06:20:39.329177
5	11	3	2025-03-25	2025-03-28	pending	\N	75.99	2025-02-25 20:13:21.022306
6	1	1	2025-05-02	2025-05-06	cancelled	\N	150.00	2025-02-25 22:07:33.182426
7	2	1	2025-02-25	2025-02-26	pending	\N	15.00	2025-02-25 23:02:27.639603
8	3	1	2025-02-25	2025-02-26	pending	\N	35.00	2025-02-25 23:36:09.37241
9	3	1	2025-02-25	2025-02-26	pending	\N	35.00	2025-02-25 23:39:42.680406
10	3	1	2025-02-25	2025-02-26	pending	\N	35.00	2025-02-25 23:39:50.034069
11	11	1	2025-02-26	2025-02-27	pending	\N	25.00	2025-02-26 01:41:33.335599
12	11	13	2025-02-26	2025-02-27	pending	\N	25.00	2025-02-26 03:20:28.66675
13	11	13	2025-02-27	2025-02-28	pending	\N	25.00	2025-02-26 03:34:33.164111
14	13	13	2025-02-27	2025-02-28	pending	\N	999.00	2025-02-26 04:57:43.26991
16	15	13	2025-02-26	2025-02-27	completed	\N	20.00	2025-02-26 05:34:12.257858
15	15	13	2025-02-26	2025-02-27	completed	\N	20.00	2025-02-26 05:33:18.055356
18	15	13	2025-02-26	2025-02-27	completed	\N	20.00	2025-02-26 05:50:03.363365
17	15	13	2025-02-26	2025-02-27	completed	\N	20.00	2025-02-26 05:47:05.435316
\.


--
-- Data for Name: support_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_requests (id, user_id, type, message, status, created_at, name, email, phone, address) FROM stdin;
2	2	application	Need to update tool listing	finished	2025-02-24 06:20:39.330074	\N	\N	\N	\N
4	4	technical	Cannot upload tool images	finished	2025-02-24 06:20:39.330074	\N	\N	\N	\N
6	\N	general	Please work	finished	2025-02-26 03:59:32.323846	Test SDssdsds	peepzprtz@gmail.com	00921387222	SDSADSDDS
5	\N	general	asdsadsds	finished	2025-02-26 03:44:25.287362	sdfdsfdsf	dsfdsfdsfd@gmail.com	01238923972	peepzprtz@gmail.com
1	1	technical	Having issues with payment system	rejected	2025-02-24 06:20:39.330074	\N	\N	\N	\N
3	5	other	Question about rental extension	finished	2025-02-24 06:20:39.330074	\N	\N	\N	\N
\.


--
-- Data for Name: tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tools (id, name, price_per_day, description, image_url, owner_id, status, created_at) FROM stdin;
3	Wrench Set	35.00	Complete wrench set	/images/tools/wrench-set.jpg	4	active	2025-02-24 06:20:39.327759
4	Circular Saw	45.00	Electric circular saw	/images/tools/circular-saw.jpg	4	active	2025-02-24 06:20:39.327759
6	Screwdriver Set	20.00	Multi-head screwdriver set	/images/tools/screwdiver-set.jpg	4	active	2025-02-24 06:20:39.327759
8	Pliers	12.00	Multi-purpose pliers	/images/tools/piler.jpg	4	active	2025-02-24 06:20:39.327759
9	Wire Cutter	15.00	Heavy-duty wire cutter	/images/tools/wire-cutter.jpg	2	active	2025-02-24 06:20:39.327759
11	Power Drill	25.00	Professional grade power drill	/images/tools/powerdrill.jpg	2	active	2025-02-24 22:59:46.2753
1	Updated Power Drill	30.00	Professional grade power drill	/images/tools/powerdrill.jpg	2	active	2025-02-24 06:20:39.327759
10	Heat Gun	40.00	Industrial heat gun	/images/tools/Heat-gun.jpg	4	inactive	2025-02-24 06:20:39.327759
7	Level Tool	18.00	Professional level tool	/images/tools/leveling-tool.jpg	2	inactive	2025-02-24 06:20:39.327759
2	Hammer-kun	15.00	Heavy-duty hammer	/images/tools/hammer.jpg	2	active	2025-02-24 06:20:39.327759
5	Measuring Tape	10.00	Professional measuring tape	/images/tools/measuring-tape.jpg	2	inactive	2025-02-24 06:20:39.327759
12	Hammu	10.00	asdsads	/images/tools/GkZ8m7TWUAAbDSQ.jpg	2	inactive	2025-02-26 04:54:55.936306
13	Test listing	999.00	Good	/images/tools/Heat-gun.jpg	2	active	2025-02-26 04:56:41.527564
14	I love seals	10.00	you too?	\N	14	active	2025-02-26 05:10:35.885118
15	Hammer Ultimate Pro Max	20.00	good hammer yeah	\N	15	active	2025-02-26 05:27:38.290293
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role, address, phone, date_of_birth, created_at, status, full_name) FROM stdin;
2	sarah_renter	sarah@example.com	password123	renter	456 Oak St, City	555-0102	1985-03-20	2025-02-24 06:20:39.326024	active	\N
3	admin_jane	admin@example.com	admin123	admin	789 Admin St, City	555-0103	1988-07-10	2025-02-24 06:20:39.326024	active	\N
4	mike_renter	mike@example.com	password123	renter	321 Pine St, City	555-0104	1992-11-05	2025-02-24 06:20:39.326024	active	\N
5	lisa_user	lisa@example.com	password123	user	654 Elm St, City	555-0105	1995-09-25	2025-02-24 06:20:39.326024	active	\N
1	john_updated	john_updated@example.com	password123	user	123 Main St, City	555-0101	1990-01-15	2025-02-24 06:20:39.326024	inactive	\N
6	john_user	john@example.com	password123	user	\N	\N	\N	2025-02-24 20:32:47.697646	active	\N
11	john_demo	john.demo@example.com	password123	user	123 Demo Street, Demo City, DC 12345	555-0123	1990-01-01	2025-02-26 00:32:11.570803	active	\N
12	aslkdjsds	sdsdsds@gmail.com	123456	\N	sdsd	091239287329	2025-01-08	2025-02-26 00:47:01.208994	active	\N
13	testuser1	wieuryeiruy@gmail.com	123456	\N	asdasdsadasdasd, asdsadsd, sadsdsd	10293823878	2025-02-05	2025-02-26 00:58:49.981955	active	Test
14	testrenter1	asdsadsad@gmail.com	123456	\N	\N	\N	\N	2025-02-26 05:09:41.447723	active	sad
15	testrenter2	peepzprtz@gmail.com	123456	\N	\N	\N	\N	2025-02-26 05:26:58.508078	active	\N
\.


--
-- Name: history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.history_id_seq', 14, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 22, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 18, true);


--
-- Name: rentals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rentals_id_seq', 18, true);


--
-- Name: support_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.support_requests_id_seq', 6, true);


--
-- Name: tools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tools_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- Name: history history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: rentals rentals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_pkey PRIMARY KEY (id);


--
-- Name: support_requests support_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests
    ADD CONSTRAINT support_requests_pkey PRIMARY KEY (id);


--
-- Name: tools tools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tools
    ADD CONSTRAINT tools_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_history_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_history_created_at ON public.history USING btree (created_at);


--
-- Name: idx_history_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_history_order_id ON public.history USING btree (order_id);


--
-- Name: idx_history_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_history_user_id ON public.history USING btree (user_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_tool_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_tool_id ON public.orders USING btree (tool_id);


--
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: idx_payments_payment_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_payment_date ON public.payments USING btree (payment_date);


--
-- Name: idx_payments_rental_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_rental_id ON public.payments USING btree (rental_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_tools_owner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tools_owner ON public.tools USING btree (owner_id);


--
-- Name: history history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: history history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders orders_tool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_rental_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_rental_id_fkey FOREIGN KEY (rental_id) REFERENCES public.rentals(id);


--
-- Name: rentals rentals_renter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_renter_id_fkey FOREIGN KEY (renter_id) REFERENCES public.users(id);


--
-- Name: rentals rentals_tool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id);


--
-- Name: support_requests support_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests
    ADD CONSTRAINT support_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tools tools_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tools
    ADD CONSTRAINT tools_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

