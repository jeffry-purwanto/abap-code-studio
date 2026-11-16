// dummy-data.js — Simulated SAP database tables for ABAP learning
// ABAP Code Studio — Created by jeffrypurwanto

window.ABAP_DB = {

  // ── SCARR: Airline Carriers ─────────────────────────────
  SCARR: [
    { MANDT: '800', CARRID: 'AA', CARRNAME: 'American Airlines',   CURRCODE: 'USD', URL: 'http://www.aa.com' },
    { MANDT: '800', CARRID: 'GA', CARRNAME: 'Garuda Indonesia',    CURRCODE: 'IDR', URL: 'http://www.garuda-indonesia.com' },
    { MANDT: '800', CARRID: 'LH', CARRNAME: 'Lufthansa',           CURRCODE: 'EUR', URL: 'http://www.lufthansa.com' },
    { MANDT: '800', CARRID: 'SQ', CARRNAME: 'Singapore Airlines',  CURRCODE: 'SGD', URL: 'http://www.singaporeair.com' },
    { MANDT: '800', CARRID: 'QF', CARRNAME: 'Qantas Airways',      CURRCODE: 'AUD', URL: 'http://www.qantas.com.au' },
    { MANDT: '800', CARRID: 'UA', CARRNAME: 'United Airlines',     CURRCODE: 'USD', URL: 'http://www.united.com' },
    { MANDT: '800', CARRID: 'JL', CARRNAME: 'Japan Airlines',      CURRCODE: 'JPY', URL: 'http://www.jal.co.jp' },
    { MANDT: '800', CARRID: 'CX', CARRNAME: 'Cathay Pacific',      CURRCODE: 'HKD', URL: 'http://www.cathaypacific.com' },
  ],

  // ── SPFLI: Flight Connections ───────────────────────────
  SPFLI: [
    { MANDT: '800', CARRID: 'GA', CONNID: '0401', COUNTRYFR: 'ID', CITYFROM: 'Jakarta',    AIRPFROM: 'CGK', COUNTRYTO: 'ID', CITYTO: 'Bali',         AIRPTO: 'DPS', FLTIME: 90,  DEPTIME: '060000', ARRTIME: '073000', DISTANCE: 940,  DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'GA', CONNID: '0402', COUNTRYFR: 'ID', CITYFROM: 'Jakarta',    AIRPFROM: 'CGK', COUNTRYTO: 'ID', CITYTO: 'Surabaya',     AIRPTO: 'SUB', FLTIME: 70,  DEPTIME: '080000', ARRTIME: '091000', DISTANCE: 650,  DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'GA', CONNID: '0403', COUNTRYFR: 'ID', CITYFROM: 'Jakarta',    AIRPFROM: 'CGK', COUNTRYTO: 'SG', CITYTO: 'Singapore',    AIRPTO: 'SIN', FLTIME: 100, DEPTIME: '100000', ARRTIME: '114000', DISTANCE: 1360, DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'SQ', CONNID: '0001', COUNTRYFR: 'SG', CITYFROM: 'Singapore',  AIRPFROM: 'SIN', COUNTRYTO: 'US', CITYTO: 'Los Angeles',  AIRPTO: 'LAX', FLTIME: 870, DEPTIME: '235500', ARRTIME: '055500', DISTANCE: 14100,DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'LH', CONNID: '0400', COUNTRYFR: 'DE', CITYFROM: 'Frankfurt',  AIRPFROM: 'FRA', COUNTRYTO: 'US', CITYTO: 'New York',     AIRPTO: 'JFK', FLTIME: 530, DEPTIME: '100000', ARRTIME: '131000', DISTANCE: 6200, DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'AA', CONNID: '0017', COUNTRYFR: 'US', CITYFROM: 'New York',   AIRPFROM: 'JFK', COUNTRYTO: 'DE', CITYTO: 'Frankfurt',    AIRPTO: 'FRA', FLTIME: 480, DEPTIME: '181000', ARRTIME: '070000', DISTANCE: 6200, DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'JL', CONNID: '0407', COUNTRYFR: 'JP', CITYFROM: 'Tokyo',      AIRPFROM: 'NRT', COUNTRYTO: 'ID', CITYTO: 'Jakarta',      AIRPTO: 'CGK', FLTIME: 440, DEPTIME: '110000', ARRTIME: '163000', DISTANCE: 5750, DISTID: 'KM', FLTYPE: ' ' },
    { MANDT: '800', CARRID: 'CX', CONNID: '0715', COUNTRYFR: 'HK', CITYFROM: 'Hong Kong',  AIRPFROM: 'HKG', COUNTRYTO: 'ID', CITYTO: 'Jakarta',      AIRPTO: 'CGK', FLTIME: 230, DEPTIME: '090000', ARRTIME: '132000', DISTANCE: 3200, DISTID: 'KM', FLTYPE: ' ' },
  ],

  // ── SFLIGHT: Flights ────────────────────────────────────
  SFLIGHT: [
    { MANDT: '800', CARRID: 'GA', CONNID: '0401', FLDATE: '20241101', PRICE: 850000,  CURRENCY: 'IDR', PLANETYPE: 'A330', SEATSMAX: 280, SEATSOCC: 254, PAYMENTSUM: 215900000, SEATSMAX_B: 42, SEATSOCC_B: 38, SEATSMAX_F: 12, SEATSOCC_F: 10 },
    { MANDT: '800', CARRID: 'GA', CONNID: '0401', FLDATE: '20241108', PRICE: 850000,  CURRENCY: 'IDR', PLANETYPE: 'A330', SEATSMAX: 280, SEATSOCC: 210, PAYMENTSUM: 178500000, SEATSMAX_B: 42, SEATSOCC_B: 30, SEATSMAX_F: 12, SEATSOCC_F: 8  },
    { MANDT: '800', CARRID: 'GA', CONNID: '0402', FLDATE: '20241101', PRICE: 650000,  CURRENCY: 'IDR', PLANETYPE: 'B737', SEATSMAX: 162, SEATSOCC: 155, PAYMENTSUM: 100750000, SEATSMAX_B: 16, SEATSOCC_B: 14, SEATSMAX_F: 0,  SEATSOCC_F: 0  },
    { MANDT: '800', CARRID: 'GA', CONNID: '0403', FLDATE: '20241105', PRICE: 2500000, CURRENCY: 'IDR', PLANETYPE: 'A320', SEATSMAX: 180, SEATSOCC: 162, PAYMENTSUM: 405000000, SEATSMAX_B: 20, SEATSOCC_B: 18, SEATSMAX_F: 0,  SEATSOCC_F: 0  },
    { MANDT: '800', CARRID: 'SQ', CONNID: '0001', FLDATE: '20241103', PRICE: 1200,    CURRENCY: 'SGD', PLANETYPE: 'A380', SEATSMAX: 471, SEATSOCC: 420, PAYMENTSUM: 504000,     SEATSMAX_B: 60, SEATSOCC_B: 55, SEATSMAX_F: 12, SEATSOCC_F: 11 },
    { MANDT: '800', CARRID: 'LH', CONNID: '0400', FLDATE: '20241102', PRICE: 850,     CURRENCY: 'EUR', PLANETYPE: 'B747', SEATSMAX: 376, SEATSOCC: 310, PAYMENTSUM: 263500,     SEATSMAX_B: 48, SEATSOCC_B: 40, SEATSMAX_F: 16, SEATSOCC_F: 12 },
    { MANDT: '800', CARRID: 'AA', CONNID: '0017', FLDATE: '20241104', PRICE: 720,     CURRENCY: 'USD', PLANETYPE: 'B777', SEATSMAX: 350, SEATSOCC: 298, PAYMENTSUM: 214560,     SEATSMAX_B: 36, SEATSOCC_B: 32, SEATSMAX_F: 8,  SEATSOCC_F: 6  },
    { MANDT: '800', CARRID: 'JL', CONNID: '0407', FLDATE: '20241106', PRICE: 95000,   CURRENCY: 'JPY', PLANETYPE: 'B787', SEATSMAX: 240, SEATSOCC: 200, PAYMENTSUM: 19000000,   SEATSMAX_B: 42, SEATSOCC_B: 35, SEATSMAX_F: 8,  SEATSOCC_F: 7  },
  ],

  // ── SBOOK: Flight Bookings ──────────────────────────────
  SBOOK: [
    { MANDT: '800', CARRID: 'GA', CONNID: '0401', FLDATE: '20241101', BOOKID: '00000001', CUSTOMID: '00000001', CUSTTYPE: 'B', SMOKER: ' ', LUGGWEIGHT: 20, WUNIT: 'KG', INVOICE: ' ', CLASS: 'Y', FORCURAM: 850000,  FORCURKEY: 'IDR', LOCCURAM: 850000,  LOCCURKEY: 'IDR', ORDER_DATE: '20241001', COUNTER: '00000001', AGENCYNUM: '00000001', CANCELLED: ' ', RESERVED: ' ' },
    { MANDT: '800', CARRID: 'GA', CONNID: '0401', FLDATE: '20241101', BOOKID: '00000002', CUSTOMID: '00000002', CUSTTYPE: 'P', SMOKER: ' ', LUGGWEIGHT: 15, WUNIT: 'KG', INVOICE: ' ', CLASS: 'C', FORCURAM: 2500000, FORCURKEY: 'IDR', LOCCURAM: 2500000, LOCCURKEY: 'IDR', ORDER_DATE: '20241005', COUNTER: '00000001', AGENCYNUM: '00000001', CANCELLED: ' ', RESERVED: ' ' },
    { MANDT: '800', CARRID: 'GA', CONNID: '0402', FLDATE: '20241101', BOOKID: '00000001', CUSTOMID: '00000003', CUSTTYPE: 'P', SMOKER: ' ', LUGGWEIGHT: 23, WUNIT: 'KG', INVOICE: ' ', CLASS: 'Y', FORCURAM: 650000,  FORCURKEY: 'IDR', LOCCURAM: 650000,  LOCCURKEY: 'IDR', ORDER_DATE: '20241010', COUNTER: '00000002', AGENCYNUM: '00000001', CANCELLED: ' ', RESERVED: ' ' },
    { MANDT: '800', CARRID: 'SQ', CONNID: '0001', FLDATE: '20241103', BOOKID: '00000001', CUSTOMID: '00000004', CUSTTYPE: 'B', SMOKER: ' ', LUGGWEIGHT: 30, WUNIT: 'KG', INVOICE: 'X', CLASS: 'F', FORCURAM: 5500,    FORCURKEY: 'SGD', LOCCURAM: 5500,    LOCCURKEY: 'SGD', ORDER_DATE: '20240901', COUNTER: '00000003', AGENCYNUM: '00000002', CANCELLED: ' ', RESERVED: ' ' },
    { MANDT: '800', CARRID: 'LH', CONNID: '0400', FLDATE: '20241102', BOOKID: '00000001', CUSTOMID: '00000005', CUSTTYPE: 'P', SMOKER: ' ', LUGGWEIGHT: 20, WUNIT: 'KG', INVOICE: ' ', CLASS: 'Y', FORCURAM: 850,     FORCURKEY: 'EUR', LOCCURAM: 850,     LOCCURKEY: 'EUR', ORDER_DATE: '20241015', COUNTER: '00000004', AGENCYNUM: '00000003', CANCELLED: ' ', RESERVED: ' ' },
  ],

  // ── MARA: Material Master ───────────────────────────────
  MARA: [
    { MANDT: '800', MATNR: '1000-100', ERSDA: '20200101', ERNAM: 'ADMIN', MTART: 'FERT', MBRSH: 'M', MATKL: '001', MEINS: 'EA', BRGEW: 2.5,  NTGEW: 2.2,  GEWEI: 'KG', VOLUM: 5.0,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
    { MANDT: '800', MATNR: '1000-200', ERSDA: '20200201', ERNAM: 'ADMIN', MTART: 'FERT', MBRSH: 'M', MATKL: '001', MEINS: 'EA', BRGEW: 1.5,  NTGEW: 1.3,  GEWEI: 'KG', VOLUM: 2.5,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
    { MANDT: '800', MATNR: '1000-300', ERSDA: '20200301', ERNAM: 'ADMIN', MTART: 'HALB', MBRSH: 'M', MATKL: '002', MEINS: 'EA', BRGEW: 0.8,  NTGEW: 0.7,  GEWEI: 'KG', VOLUM: 1.0,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
    { MANDT: '800', MATNR: '2000-100', ERSDA: '20200401', ERNAM: 'ADMIN', MTART: 'ROH',  MBRSH: 'M', MATKL: '003', MEINS: 'KG', BRGEW: 1.0,  NTGEW: 1.0,  GEWEI: 'KG', VOLUM: 0.5,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
    { MANDT: '800', MATNR: '2000-200', ERSDA: '20200501', ERNAM: 'ADMIN', MTART: 'ROH',  MBRSH: 'M', MATKL: '003', MEINS: 'KG', BRGEW: 1.0,  NTGEW: 1.0,  GEWEI: 'KG', VOLUM: 0.5,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
    { MANDT: '800', MATNR: '3000-100', ERSDA: '20200601', ERNAM: 'ADMIN', MTART: 'DIEN', MBRSH: 'D', MATKL: '004', MEINS: 'AU', BRGEW: 0.0,  NTGEW: 0.0,  GEWEI: 'KG', VOLUM: 0.0,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
    { MANDT: '800', MATNR: '4000-100', ERSDA: '20200701', ERNAM: 'ADMIN', MTART: 'HAWA', MBRSH: 'M', MATKL: '005', MEINS: 'EA', BRGEW: 0.3,  NTGEW: 0.25, GEWEI: 'KG', VOLUM: 0.2,  VOLEH: 'L',  MSTAE: '', MSTAV: '', BMATN: '' },
  ],

  // ── MAKT: Material Descriptions ────────────────────────
  MAKT: [
    { MANDT: '800', MATNR: '1000-100', SPRAS: 'EN', MAKTX: 'Laptop Pro 15"' },
    { MANDT: '800', MATNR: '1000-100', SPRAS: 'ID', MAKTX: 'Laptop Pro 15 inci' },
    { MANDT: '800', MATNR: '1000-200', SPRAS: 'EN', MAKTX: 'Wireless Mouse' },
    { MANDT: '800', MATNR: '1000-200', SPRAS: 'ID', MAKTX: 'Mouse Nirkabel' },
    { MANDT: '800', MATNR: '1000-300', SPRAS: 'EN', MAKTX: 'USB-C Hub Adapter' },
    { MANDT: '800', MATNR: '1000-300', SPRAS: 'ID', MAKTX: 'Adaptor Hub USB-C' },
    { MANDT: '800', MATNR: '2000-100', SPRAS: 'EN', MAKTX: 'Aluminum Sheet 1mm' },
    { MANDT: '800', MATNR: '2000-200', SPRAS: 'EN', MAKTX: 'Copper Wire 2.5mm' },
    { MANDT: '800', MATNR: '3000-100', SPRAS: 'EN', MAKTX: 'Software Maintenance Service' },
    { MANDT: '800', MATNR: '4000-100', SPRAS: 'EN', MAKTX: 'HDMI Cable 2m' },
  ],

  // ── KNA1: Customer Master ───────────────────────────────
  KNA1: [
    { MANDT: '800', KUNNR: '0000001000', NAME1: 'PT Maju Bersama',       ORT01: 'Jakarta',   LAND1: 'ID', STRAS: 'Jl. Sudirman No. 100', TELF1: '021-5551234', BRSCH: 'TECH', KTOKD: 'DEBI' },
    { MANDT: '800', KUNNR: '0000001001', NAME1: 'CV Karya Nusantara',    ORT01: 'Bandung',   LAND1: 'ID', STRAS: 'Jl. Asia Afrika No. 50', TELF1: '022-5559876', BRSCH: 'MANF', KTOKD: 'DEBI' },
    { MANDT: '800', KUNNR: '0000001002', NAME1: 'PT Global Teknindo',    ORT01: 'Surabaya',  LAND1: 'ID', STRAS: 'Jl. Pemuda No. 200',    TELF1: '031-5554321', BRSCH: 'TECH', KTOKD: 'DEBI' },
    { MANDT: '800', KUNNR: '0000001003', NAME1: 'Singapore Tech Pte Ltd', ORT01: 'Singapore', LAND1: 'SG', STRAS: '1 Raffles Place',        TELF1: '+65-6555-1234', BRSCH: 'TECH', KTOKD: 'DEBI' },
    { MANDT: '800', KUNNR: '0000001004', NAME1: 'Acme Corp USA',         ORT01: 'New York',  LAND1: 'US', STRAS: '1 Broadway Ave',          TELF1: '+1-212-555-9900', BRSCH: 'RETL', KTOKD: 'DEBI' },
    { MANDT: '800', KUNNR: '0000001005', NAME1: 'PT Sentosa Jaya',       ORT01: 'Medan',     LAND1: 'ID', STRAS: 'Jl. Gatot Subroto No. 10', TELF1: '061-5558765', BRSCH: 'TRAD', KTOKD: 'DEBI' },
  ],

  // ── LFA1: Vendor Master ─────────────────────────────────
  LFA1: [
    { MANDT: '800', LIFNR: '0000100001', NAME1: 'PT Supplier Utama',    ORT01: 'Jakarta',   LAND1: 'ID', STRAS: 'Jl. Industri No. 5',      TELF1: '021-5557890', BRSCH: 'MANF', KTOKK: 'KRED' },
    { MANDT: '800', LIFNR: '0000100002', NAME1: 'CV Bahan Baku Jaya',   ORT01: 'Bekasi',    LAND1: 'ID', STRAS: 'Kawasan Industri MM2100', TELF1: '021-8975432', BRSCH: 'MANF', KTOKK: 'KRED' },
    { MANDT: '800', LIFNR: '0000100003', NAME1: 'Global Parts Co.',      ORT01: 'Shanghai',  LAND1: 'CN', STRAS: '88 Nanjing Road',          TELF1: '+86-21-6555-8888', BRSCH: 'MANF', KTOKK: 'KRED' },
    { MANDT: '800', LIFNR: '0000100004', NAME1: 'TechParts Korea',       ORT01: 'Seoul',     LAND1: 'KR', STRAS: '100 Teheran-ro',           TELF1: '+82-2-5555-7777', BRSCH: 'TECH', KTOKK: 'KRED' },
  ],

  // ── T001: Company Codes ─────────────────────────────────
  T001: [
    { MANDT: '800', BUKRS: '1000', BUTXT: 'PT ABC Indonesia',      ORT01: 'Jakarta',  LAND1: 'ID', WAERS: 'IDR', KTOPL: 'INT', PERIV: 'V3' },
    { MANDT: '800', BUKRS: '2000', BUTXT: 'Singapore Branch',       ORT01: 'Singapore', LAND1: 'SG', WAERS: 'SGD', KTOPL: 'INT', PERIV: 'V3' },
    { MANDT: '800', BUKRS: '3000', BUTXT: 'Germany HQ GmbH',        ORT01: 'Frankfurt', LAND1: 'DE', WAERS: 'EUR', KTOPL: 'INT', PERIV: 'V3' },
  ],

  // ── T005: Countries ─────────────────────────────────────
  T005: [
    { MANDT: '800', LAND1: 'ID', LANDX: 'Indonesia',       SPRAS: 'EN', WAERS: 'IDR' },
    { MANDT: '800', LAND1: 'SG', LANDX: 'Singapore',       SPRAS: 'EN', WAERS: 'SGD' },
    { MANDT: '800', LAND1: 'US', LANDX: 'United States',   SPRAS: 'EN', WAERS: 'USD' },
    { MANDT: '800', LAND1: 'DE', LANDX: 'Germany',         SPRAS: 'EN', WAERS: 'EUR' },
    { MANDT: '800', LAND1: 'JP', LANDX: 'Japan',           SPRAS: 'EN', WAERS: 'JPY' },
    { MANDT: '800', LAND1: 'AU', LANDX: 'Australia',       SPRAS: 'EN', WAERS: 'AUD' },
    { MANDT: '800', LAND1: 'HK', LANDX: 'Hong Kong',       SPRAS: 'EN', WAERS: 'HKD' },
    { MANDT: '800', LAND1: 'CN', LANDX: 'China',           SPRAS: 'EN', WAERS: 'CNY' },
    { MANDT: '800', LAND1: 'KR', LANDX: 'South Korea',     SPRAS: 'EN', WAERS: 'KRW' },
  ],

  // ── VBAK: Sales Order Header ────────────────────────────
  VBAK: [
    { MANDT: '800', VBELN: '0000000001', ERDAT: '20241001', ERZET: '090000', ERNAM: 'SALES01', ANGDT: '20241001', BNDDT: '20241031', AUDAT: '20241001', VBTYP: 'C', TRVOG: ' ', AUART: 'TA', AUGRU: '', GWLDT: '', SUBMI: '', LIFSK: '', FAKSK: '', VKORG: '1000', VTWEG: '10', SPART: '00', VKGRP: '100', VKBUR: '1000', KNUMV: '0000000001', KALSM: 'RVAA01', WAERK: 'IDR', VKKUN: '', STAFO: '', STWAE: '', AEDAT: '20241001', NETWR: 15000000, KUNNR: '0000001000' },
    { MANDT: '800', VBELN: '0000000002', ERDAT: '20241005', ERZET: '110000', ERNAM: 'SALES02', ANGDT: '20241005', BNDDT: '20241105', AUDAT: '20241005', VBTYP: 'C', TRVOG: ' ', AUART: 'TA', AUGRU: '', GWLDT: '', SUBMI: '', LIFSK: '', FAKSK: '', VKORG: '1000', VTWEG: '10', SPART: '00', VKGRP: '100', VKBUR: '1000', KNUMV: '0000000002', KALSM: 'RVAA01', WAERK: 'IDR', VKKUN: '', STAFO: '', STWAE: '', AEDAT: '20241005', NETWR: 8500000,  KUNNR: '0000001001' },
    { MANDT: '800', VBELN: '0000000003', ERDAT: '20241010', ERZET: '140000', ERNAM: 'SALES01', ANGDT: '20241010', BNDDT: '20241110', AUDAT: '20241010', VBTYP: 'C', TRVOG: ' ', AUART: 'TA', AUGRU: '', GWLDT: '', SUBMI: '', LIFSK: '', FAKSK: '', VKORG: '1000', VTWEG: '10', SPART: '00', VKGRP: '100', VKBUR: '1000', KNUMV: '0000000003', KALSM: 'RVAA01', WAERK: 'IDR', VKKUN: '', STAFO: '', STWAE: '', AEDAT: '20241010', NETWR: 25000000, KUNNR: '0000001002' },
  ],

  // ── VBAP: Sales Order Items ─────────────────────────────
  VBAP: [
    { MANDT: '800', VBELN: '0000000001', POSNR: '000010', MATNR: '1000-100', ARKTX: 'Laptop Pro 15"',       MATKL: '001', WERKS: '1000', LGORT: '0001', MEINS: 'EA', KWMENG: 5,  NETWR: 12500000, WAERK: 'IDR' },
    { MANDT: '800', VBELN: '0000000001', POSNR: '000020', MATNR: '1000-200', ARKTX: 'Wireless Mouse',       MATKL: '001', WERKS: '1000', LGORT: '0001', MEINS: 'EA', KWMENG: 10, NETWR: 2500000,  WAERK: 'IDR' },
    { MANDT: '800', VBELN: '0000000002', POSNR: '000010', MATNR: '4000-100', ARKTX: 'HDMI Cable 2m',        MATKL: '005', WERKS: '1000', LGORT: '0001', MEINS: 'EA', KWMENG: 50, NETWR: 8500000,  WAERK: 'IDR' },
    { MANDT: '800', VBELN: '0000000003', POSNR: '000010', MATNR: '1000-100', ARKTX: 'Laptop Pro 15"',       MATKL: '001', WERKS: '1000', LGORT: '0001', MEINS: 'EA', KWMENG: 10, NETWR: 25000000, WAERK: 'IDR' },
  ],

  // ── EKKO: Purchase Order Header ─────────────────────────
  EKKO: [
    { MANDT: '800', EBELN: '4500000001', BUKRS: '1000', BSTYP: 'F', BSART: 'NB', LOEKZ: '', AEDAT: '20240902', ERNAM: 'BUYER01', LIFNR: '0000100001', EKORG: '1000', EKGRP: '001', WAERS: 'USD', BEDAT: '20240902' },
    { MANDT: '800', EBELN: '4500000002', BUKRS: '1000', BSTYP: 'F', BSART: 'NB', LOEKZ: '', AEDAT: '20240915', ERNAM: 'BUYER01', LIFNR: '0000100002', EKORG: '1000', EKGRP: '001', WAERS: 'USD', BEDAT: '20240915' },
    { MANDT: '800', EBELN: '4500000003', BUKRS: '1000', BSTYP: 'F', BSART: 'NB', LOEKZ: '', AEDAT: '20241003', ERNAM: 'BUYER02', LIFNR: '0000100003', EKORG: '1000', EKGRP: '002', WAERS: 'USD', BEDAT: '20241003' },
    { MANDT: '800', EBELN: '4500000004', BUKRS: '1000', BSTYP: 'F', BSART: 'NB', LOEKZ: '', AEDAT: '20241020', ERNAM: 'BUYER02', LIFNR: '0000100009', EKORG: '1000', EKGRP: '002', WAERS: 'USD', BEDAT: '20241020' },
    { MANDT: '800', EBELN: '4500000005', BUKRS: '2000', BSTYP: 'F', BSART: 'NB', LOEKZ: '', AEDAT: '20241105', ERNAM: 'BUYER03', LIFNR: '0000100004', EKORG: '2000', EKGRP: '003', WAERS: 'SGD', BEDAT: '20241105' },
  ],

  // ── EKPO: Purchase Order Items ──────────────────────────
  EKPO: [
    { MANDT: '800', EBELN: '4500000001', EBELP: '00010', LOEKZ: '',  TXZ01: 'Aluminum Sheet 1mm',  MATNR: '2000-100', WERKS: '1000', LGORT: '0001', MATKL: '003', MENGE: 500, MEINS: 'KG', NETPR: 12.5,  PEINH: 1, NETWR: 6250 },
    { MANDT: '800', EBELN: '4500000001', EBELP: '00020', LOEKZ: '',  TXZ01: 'Copper Wire 2.5mm',   MATNR: '2000-200', WERKS: '1000', LGORT: '0001', MATKL: '003', MENGE: 800, MEINS: 'KG', NETPR: 18.75, PEINH: 1, NETWR: 15000 },
    { MANDT: '800', EBELN: '4500000002', EBELP: '00010', LOEKZ: '',  TXZ01: 'USB-C Hub Adapter',   MATNR: '1000-300', WERKS: '1000', LGORT: '0002', MATKL: '002', MENGE: 200, MEINS: 'EA', NETPR: 22,    PEINH: 1, NETWR: 4400 },
    { MANDT: '800', EBELN: '4500000002', EBELP: '00020', LOEKZ: 'L', TXZ01: 'HDMI Cable 2m',       MATNR: '4000-100', WERKS: '1000', LGORT: '0002', MATKL: '005', MENGE: 100, MEINS: 'EA', NETPR: 4.5,   PEINH: 1, NETWR: 450 },
    { MANDT: '800', EBELN: '4500000003', EBELP: '00010', LOEKZ: '',  TXZ01: 'Laptop Pro 15"',      MATNR: '1000-100', WERKS: '1000', LGORT: '0001', MATKL: '001', MENGE: 25,  MEINS: 'EA', NETPR: 950,   PEINH: 1, NETWR: 23750 },
    { MANDT: '800', EBELN: '4500000003', EBELP: '00020', LOEKZ: '',  TXZ01: 'Wireless Mouse',      MATNR: '1000-200', WERKS: '1000', LGORT: '0001', MATKL: '001', MENGE: 150, MEINS: 'EA', NETPR: 14,    PEINH: 1, NETWR: 2100 },
    { MANDT: '800', EBELN: '4500000004', EBELP: '00010', LOEKZ: '',  TXZ01: 'Packaging Material',  MATNR: '5000-900', WERKS: '1000', LGORT: '0003', MATKL: '009', MENGE: 60,  MEINS: 'EA', NETPR: 3.2,   PEINH: 1, NETWR: 192 },
    { MANDT: '800', EBELN: '4500000005', EBELP: '00010', LOEKZ: '',  TXZ01: 'HDMI Cable 2m',       MATNR: '4000-100', WERKS: '2000', LGORT: '0001', MATKL: '005', MENGE: 400, MEINS: 'EA', NETPR: 6,     PEINH: 1, NETWR: 2400 },
  ],

  // ── T001W: Plants ───────────────────────────────────────
  T001W: [
    { MANDT: '800', WERKS: '1000', NAME1: 'Pabrik Jakarta',    ORT01: 'Jakarta',   LAND1: 'ID', BUKRS: '1000' },
    { MANDT: '800', WERKS: '1100', NAME1: 'Gudang Surabaya',   ORT01: 'Surabaya',  LAND1: 'ID', BUKRS: '1000' },
    { MANDT: '800', WERKS: '2000', NAME1: 'Singapore DC',      ORT01: 'Singapore', LAND1: 'SG', BUKRS: '2000' },
  ],

  // ── MARC: Plant Data for Material ───────────────────────
  MARC: [
    { MANDT: '800', MATNR: '1000-100', WERKS: '1000', DISMM: 'PD', DISPO: '001', BESKZ: 'F', EISBE: 10,  PLIFZ: 14 },
    { MANDT: '800', MATNR: '1000-200', WERKS: '1000', DISMM: 'PD', DISPO: '001', BESKZ: 'F', EISBE: 50,  PLIFZ: 7  },
    { MANDT: '800', MATNR: '1000-300', WERKS: '1000', DISMM: 'PD', DISPO: '002', BESKZ: 'E', EISBE: 20,  PLIFZ: 5  },
    { MANDT: '800', MATNR: '2000-100', WERKS: '1000', DISMM: 'VB', DISPO: '003', BESKZ: 'F', EISBE: 200, PLIFZ: 21 },
    { MANDT: '800', MATNR: '2000-200', WERKS: '1000', DISMM: 'VB', DISPO: '003', BESKZ: 'F', EISBE: 300, PLIFZ: 21 },
    { MANDT: '800', MATNR: '4000-100', WERKS: '2000', DISMM: 'ND', DISPO: '004', BESKZ: 'F', EISBE: 0,   PLIFZ: 10 },
  ],

  // ── MARD: Storage Location Stock ────────────────────────
  MARD: [
    { MANDT: '800', MATNR: '1000-100', WERKS: '1000', LGORT: '0001', LABST: 42,   INSME: 0,  SPEME: 1 },
    { MANDT: '800', MATNR: '1000-200', WERKS: '1000', LGORT: '0001', LABST: 310,  INSME: 20, SPEME: 0 },
    { MANDT: '800', MATNR: '1000-300', WERKS: '1000', LGORT: '0002', LABST: 0,    INSME: 0,  SPEME: 0 },
    { MANDT: '800', MATNR: '2000-100', WERKS: '1000', LGORT: '0001', LABST: 1250, INSME: 0,  SPEME: 0 },
    { MANDT: '800', MATNR: '2000-200', WERKS: '1000', LGORT: '0001', LABST: 875,  INSME: 50, SPEME: 0 },
    { MANDT: '800', MATNR: '4000-100', WERKS: '1000', LGORT: '0002', LABST: 96,   INSME: 0,  SPEME: 4 },
    { MANDT: '800', MATNR: '4000-100', WERKS: '2000', LGORT: '0001', LABST: 400,  INSME: 0,  SPEME: 0 },
  ],

  // ── BKPF: Accounting Document Header ────────────────────
  BKPF: [
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000001', GJAHR: '2024', BLART: 'KR', BLDAT: '20241001', BUDAT: '20241002', USNAM: 'FIUSER1', WAERS: 'USD', XBLNR: 'INV-88001', BKTXT: 'Vendor invoice PO 4500000001' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000002', GJAHR: '2024', BLART: 'KZ', BLDAT: '20241015', BUDAT: '20241015', USNAM: 'FIUSER1', WAERS: 'USD', XBLNR: 'PAY-12001', BKTXT: 'Payment to vendor 100001' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000003', GJAHR: '2024', BLART: 'DR', BLDAT: '20241020', BUDAT: '20241021', USNAM: 'FIUSER2', WAERS: 'IDR', XBLNR: 'SO-0000001', BKTXT: 'Customer invoice order 1' },
  ],

  // ── BSEG: Accounting Document Items ─────────────────────
  BSEG: [
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000001', GJAHR: '2024', BUZEI: '001', BSCHL: '31', KOART: 'K', SHKZG: 'H', DMBTR: 21250,    WRBTR: 21250,    HKONT: '0021100000', LIFNR: '0000100001', KUNNR: '',           SGTXT: 'Vendor payable' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000001', GJAHR: '2024', BUZEI: '002', BSCHL: '86', KOART: 'S', SHKZG: 'S', DMBTR: 21250,    WRBTR: 21250,    HKONT: '0019100000', LIFNR: '',           KUNNR: '',           SGTXT: 'GR/IR clearing' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000002', GJAHR: '2024', BUZEI: '001', BSCHL: '25', KOART: 'K', SHKZG: 'S', DMBTR: 21250,    WRBTR: 21250,    HKONT: '0021100000', LIFNR: '0000100001', KUNNR: '',           SGTXT: 'Outgoing payment' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000002', GJAHR: '2024', BUZEI: '002', BSCHL: '50', KOART: 'S', SHKZG: 'H', DMBTR: 21250,    WRBTR: 21250,    HKONT: '0011300000', LIFNR: '',           KUNNR: '',           SGTXT: 'Bank account' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000003', GJAHR: '2024', BUZEI: '001', BSCHL: '01', KOART: 'D', SHKZG: 'S', DMBTR: 15000000, WRBTR: 15000000, HKONT: '0014000000', LIFNR: '',           KUNNR: '0000001000', SGTXT: 'Customer receivable' },
    { MANDT: '800', BUKRS: '1000', BELNR: '0100000003', GJAHR: '2024', BUZEI: '002', BSCHL: '50', KOART: 'S', SHKZG: 'H', DMBTR: 15000000, WRBTR: 15000000, HKONT: '0080000000', LIFNR: '',           KUNNR: '',           SGTXT: 'Sales revenue' },
  ],
};

// ── Helper: get table schema info ────────────────────────
window.ABAP_DB_SCHEMA = {
  SCARR:   { desc: 'Airline Carriers',         fields: ['MANDT','CARRID','CARRNAME','CURRCODE','URL'] },
  SPFLI:   { desc: 'Flight Connections',       fields: ['MANDT','CARRID','CONNID','COUNTRYFR','CITYFROM','AIRPFROM','COUNTRYTO','CITYTO','AIRPTO','FLTIME','DEPTIME','ARRTIME','DISTANCE','DISTID'] },
  SFLIGHT: { desc: 'Flight Schedule',          fields: ['MANDT','CARRID','CONNID','FLDATE','PRICE','CURRENCY','PLANETYPE','SEATSMAX','SEATSOCC','PAYMENTSUM'] },
  SBOOK:   { desc: 'Flight Bookings',          fields: ['MANDT','CARRID','CONNID','FLDATE','BOOKID','CUSTOMID','CLASS','FORCURAM','FORCURKEY','ORDER_DATE'] },
  MARA:    { desc: 'Material Master General',  fields: ['MANDT','MATNR','ERSDA','ERNAM','MTART','MBRSH','MATKL','MEINS','BRGEW','NTGEW','GEWEI'] },
  MAKT:    { desc: 'Material Descriptions',    fields: ['MANDT','MATNR','SPRAS','MAKTX'] },
  KNA1:    { desc: 'Customer Master',          fields: ['MANDT','KUNNR','NAME1','ORT01','LAND1','STRAS','TELF1','BRSCH'] },
  LFA1:    { desc: 'Vendor Master',            fields: ['MANDT','LIFNR','NAME1','ORT01','LAND1','STRAS','TELF1','BRSCH'] },
  T001:    { desc: 'Company Codes',            fields: ['MANDT','BUKRS','BUTXT','ORT01','LAND1','WAERS'] },
  T005:    { desc: 'Countries',                fields: ['MANDT','LAND1','LANDX','SPRAS','WAERS'] },
  VBAK:    { desc: 'Sales Order Header',       fields: ['MANDT','VBELN','ERDAT','ERNAM','AUART','VKORG','NETWR','KUNNR'] },
  VBAP:    { desc: 'Sales Order Items',        fields: ['MANDT','VBELN','POSNR','MATNR','ARKTX','MEINS','KWMENG','NETWR'] },
  EKKO:    { desc: 'Purchase Order Header',    fields: ['MANDT','EBELN','BUKRS','BSART','LIFNR','EKORG','EKGRP','WAERS','BEDAT','ERNAM'] },
  EKPO:    { desc: 'Purchase Order Items',     fields: ['MANDT','EBELN','EBELP','LOEKZ','TXZ01','MATNR','WERKS','MENGE','MEINS','NETPR','NETWR'] },
  T001W:   { desc: 'Plants',                   fields: ['MANDT','WERKS','NAME1','ORT01','LAND1','BUKRS'] },
  MARC:    { desc: 'Plant Data for Material',  fields: ['MANDT','MATNR','WERKS','DISMM','DISPO','BESKZ','EISBE','PLIFZ'] },
  MARD:    { desc: 'Storage Location Stock',   fields: ['MANDT','MATNR','WERKS','LGORT','LABST','INSME','SPEME'] },
  BKPF:    { desc: 'Accounting Doc. Header',   fields: ['MANDT','BUKRS','BELNR','GJAHR','BLART','BLDAT','BUDAT','WAERS','XBLNR','BKTXT'] },
  BSEG:    { desc: 'Accounting Doc. Items',    fields: ['MANDT','BUKRS','BELNR','GJAHR','BUZEI','BSCHL','KOART','SHKZG','DMBTR','HKONT','LIFNR','KUNNR','SGTXT'] },
};

