const { useState, useEffect, useMemo, useRef } = React;

/* ================= WC26 FANTASY COMMAND CENTER =================
   Live data: play.fifa.com official fantasy feeds (CORS open)
   Embedded: curated intel (start probability, set pieces, news),
   Elo ratings, projection model calibrated to expert projections. */

const INTEL = {"1099":{"st":0.93,"rw":16.54},"1085":{"st":0.78,"sp":"C","rw":16.97},"1089":{"st":0.93,"rw":16.54},"1088":{"st":0.93,"rw":18.3},"1104":{"st":0.78,"n":"Managed minutes after long injury layoff","rw":16.54},"1106":{"st":0.93,"rw":17.04},"1082":{"st":0.78,"sp":"CF","n":"Set-piece duty, huge value at 6.0","rw":19.15},"1092":{"st":0.93,"sp":"CF","n":"Managing minor injury, started June 4 friendly"},"1094":{"st":0.93,"sp":"P","n":"Top projected player; on penalties even with Yamal on pitch","rw":25.17},"1093":{"st":0.78,"n":"First-choice 9 with Samu Aghehowa out (ACL)","rw":18.92},"2000":{"st":0.55,"n":"Rotates with Ferran/Baena"},"1997":{"st":0.55,"n":"Foot stress fracture in Feb; race to full sharpness"},"1086":{"st":0.55},"1998":{"st":0.78},"45":{"st":0.93,"n":"Elite shot-stopper, penalty-save threat"},"30":{"st":0.78,"rw":17.21},"28":{"st":0.93},"31":{"st":0.78,"rw":17.69},"34":{"st":0.93,"n":"Cheapest route into ARG defense","rw":18.57},"50":{"st":0.93},"56":{"st":0.93},"57":{"st":0.78,"sp":"C"},"55":{"st":0.78,"sp":"CF","rw":17.52},"38":{"st":0.93,"sp":"PF","n":"Takes pens + FKs; final World Cup","rw":19.12},"1338":{"st":0.78},"39":{"st":0.93,"n":"Can play wide or 9; near-nailed"},"1318":{"st":0.78,"rw":17.7},"48":{"st":0.55},"506":{"st":0.93},"1430":{"st":0.78},"1429":{"st":0.93},"495":{"st":0.55},"494":{"st":0.78},"492":{"st":0.78},"515":{"st":0.93},"512":{"st":0.78},"517":{"st":0.93,"sp":"CF","n":"Corners + FKs","rw":17.84},"505":{"st":0.78,"n":"Breakout season; Ekitike injury opens minutes","rw":19.18},"501":{"st":0.78,"n":"Ballon d'Or form but rotation/fitness watch","rw":16.53},"500":{"st":0.93,"sp":"P","n":"Captain, penalties, most-owned player in game","rw":20.72},"1431":{"st":0.55},"502":{"st":0.55},"477":{"st":0.93,"n":"England didn't concede in qualifying"},"1709":{"st":0.78,"sp":"CF","rw":16.88},"466":{"st":0.55,"n":"Fitness managed"},"463":{"st":0.93,"rw":17.08},"461":{"st":0.93},"488":{"st":0.93,"sp":"C","rw":17.51},"486":{"st":0.78,"rw":16.4},"491":{"st":0.93},"469":{"st":0.35,"n":"Achilles issue since April; missed March friendlies - monitor"},"471":{"st":0.78,"rw":16.64},"468":{"st":0.93,"sp":"P","n":"68 goal contributions for Bayern; pens","rw":20.34},"1710":{"st":0.55},"474":{"st":0.55},"183":{"st":0.78},"165":{"st":0.93},"164":{"st":0.78},"167":{"st":0.78,"rw":16.63},"168":{"st":0.78,"n":"Projected starting LB; standout value 4.3","rw":18.38},"188":{"st":0.78,"rw":16.51},"1361":{"st":0.93,"sp":"C","rw":17.54},"190":{"st":0.78,"sp":"C","rw":18.09},"1366":{"st":0.93,"sp":"PCF","n":"Talisman: pens + corners + FKs; build-around pick","rw":22.06},"173":{"st":0.93,"sp":"C","rw":16.67},"174":{"st":0.78,"sp":"C"},"178":{"st":0.78,"n":"Projected starting 9; shares pen duty","rw":17.97},"1369":{"st":0.35,"n":"Calf injury; doubt for MD1 vs Morocco, back later"},"176":{"st":0.55,"n":"Extra minutes with Rodrygo/Estêvão out"},"181":{"st":0.55},"1569":{"st":0.93},"917":{"st":0.78,"sp":"C"},"1570":{"st":0.93},"919":{"st":0.78,"rw":16.7},"916":{"st":0.93},"936":{"st":0.93},"939":{"st":0.93,"sp":"CF","n":"50% owned; on corners/FKs, shares pens","rw":20.88},"1572":{"st":0.78},"1574":{"st":0.78,"rw":16.52},"1573":{"st":0.93,"sp":"P","n":"Record 6th WC at 41; still on pens","rw":16.79},"923":{"st":0.55},"925":{"st":0.55},"1598":{"st":0.93,"n":"Recalled from international retirement (ter Stegen not selected)"},"542":{"st":0.93,"sp":"CF","n":"Listed DEF at 5.5 - premium pick, set pieces","rw":18.69},"523":{"st":0.93,"rw":17.93},"526":{"st":0.93,"rw":18.18},"525":{"st":0.93,"n":"Nailed LB at 4.7; elite value","rw":18.63},"520":{"st":0.55},"1602":{"st":0.78,"rw":17.26},"540":{"st":0.55},"543":{"st":0.93,"sp":"PF","n":"Shares pens; Germany's creative hub","rw":19.6},"1600":{"st":0.93,"n":"Back to fitness, started recent friendlies","rw":19.08},"529":{"st":0.78,"rw":18.5},"528":{"st":0.93,"sp":"P","rw":18.8},"532":{"st":0.55},"1601":{"st":0.78,"rw":16.84},"809":{"st":0.93,"rw":17.52},"795":{"st":0.78,"n":"Returning from injury; monitor"},"817":{"st":0.12,"n":"Left camp - groin, out of WC"},"796":{"st":0.93},"797":{"st":0.93,"rw":16.57},"2040":{"st":0.93},"816":{"st":0.93,"rw":16.46},"812":{"st":0.78},"804":{"st":0.93,"sp":"C","rw":16.57},"2043":{"st":0.78,"sp":"PF","n":"Pens + FKs","rw":18.82},"805":{"st":0.55},"808":{"st":0.55},"1522":{"st":0.93},"117":{"st":0.78,"rw":18.45},"118":{"st":0.78},"121":{"st":0.78,"n":"3.9 enabler","rw":16.97},"123":{"st":0.78,"n":"3.7 cheapest playing DEF route","rw":16.45},"115":{"st":0.78,"rw":17.85},"138":{"st":0.93,"sp":"PCF","n":"Elite projection at 7.5, only 5% owned","rw":20.16},"137":{"st":0.93,"rw":16.94},"135":{"st":0.55},"125":{"st":0.93,"rw":18.92},"1526":{"st":0.78,"rw":18.74},"129":{"st":0.78,"n":"5.6 mid value","rw":18.67},"124":{"st":0.35,"n":"Long injury layoff; sharpness doubt"},"338":{"st":0.93},"325":{"st":0.78},"1536":{"st":0.93},"326":{"st":0.78},"346":{"st":0.93,"sp":"CF","n":"Minor cheek knock, fit for opener vs England June 17","rw":16.89},"1537":{"st":0.55,"n":"Returning from Achilles surgery"},"324":{"st":0.78},"348":{"st":0.55},"333":{"st":0.78,"sp":"P"},"334":{"st":0.78,"sp":"P"},"332":{"st":0.55},"859":{"st":0.93},"846":{"st":0.78},"849":{"st":0.78},"850":{"st":0.78},"847":{"st":0.93},"1684":{"st":0.93,"sp":"CF","rw":17.07},"841":{"st":0.93},"845":{"st":0.78},"863":{"st":0.78,"rw":17.05},"843":{"st":0.55},"855":{"st":0.93,"sp":"P","n":"16 goals in qualifying; pens","rw":17.72},"856":{"st":0.78},"757":{"st":0.93,"n":"Starter with Malagón out (Achilles); 3.9 GK value","rw":17.85},"743":{"st":0.78,"rw":16.83},"741":{"st":0.93},"740":{"st":0.93},"742":{"st":0.78},"1474":{"st":0.93},"1478":{"st":0.78,"sp":"C"},"1476":{"st":0.78,"sp":"C","n":"17-year-old breakout; host buzz"},"751":{"st":0.78,"sp":"CF"},"762":{"st":0.55,"sp":"P"},"748":{"st":0.93,"sp":"P","n":"Top-10 projected; pens; opener vs RSA in Estadio Banorte","rw":19.93},"752":{"st":0.55,"sp":"C"},"1485":{"st":0.55},"1271":{"st":0.93,"n":"Won the No.1 shirt; 4.2","rw":17.19},"2031":{"st":0.93,"n":"4.3 attacking fullback value","rw":17.88},"1259":{"st":0.93},"1261":{"st":0.78},"1258":{"st":0.93,"n":"Back from knee injury, nailed LB","rw":18.39},"2033":{"st":0.78,"n":"Back from injury; holding role"},"1255":{"st":0.78},"1250":{"st":0.78,"sp":"C"},"1254":{"st":0.78},"1256":{"st":0.55,"sp":"F"},"1274":{"st":0.93,"sp":"PCF","n":"Talisman; pens + set pieces; opener vs Paraguay June 12 LA","rw":16.96},"1267":{"st":0.78,"sp":"P"},"1266":{"st":0.55,"n":"Knee recovery; rotation"},"1265":{"st":0.78},"1211":{"st":0.93},"1197":{"st":0.78},"1201":{"st":0.93},"1200":{"st":0.78},"1195":{"st":0.78},"1216":{"st":0.93,"sp":"PCF","n":"Elite projection 7.1; all set pieces","rw":19.83},"1188":{"st":0.78},"1192":{"st":0.78},"1215":{"st":0.35,"n":"Hamstring - major doubt until ~June 14 (MD1 risk)"},"1204":{"st":0.93,"sp":"F"},"1205":{"st":0.78},"1206":{"st":0.55},"74":{"st":0.93},"2002":{"st":0.93},"61":{"st":0.78},"63":{"st":0.78},"2004":{"st":0.93,"sp":"P"},"80":{"st":0.78},"81":{"st":0.55},"68":{"st":0.55},"2006":{"st":0.55},"908":{"st":0.93},"893":{"st":0.93,"sp":"P","n":"Captain, pens, set-piece goal threat"},"895":{"st":0.93},"894":{"st":0.78},"913":{"st":0.93,"sp":"CF","n":"Engine of the side","rw":16.4},"1616":{"st":0.78},"901":{"st":0.78,"sp":"F"},"912":{"st":0.55,"n":"Knee history; game-changer off bench or starts"},"902":{"st":0.55},"2010":{"st":0.93},"2012":{"st":0.93,"sp":"PC","n":"Recovered from minor hamstring; attacking RB elite"},"2011":{"st":0.93},"2014":{"st":0.78},"2021":{"st":0.78,"sp":"C"},"2018":{"st":0.78},"2022":{"st":0.78,"sp":"C","rw":17.96},"792":{"st":0.78,"n":"Strong projection 6.8","rw":18.55},"2020":{"st":0.93,"sp":"P","rw":16.56},"777":{"st":0.55},"2023":{"st":0.55,"sp":"P"},"2024":{"st":0.55,"sp":"C"},"1025":{"st":0.93},"1577":{"st":0.78},"1013":{"st":0.78},"1018":{"st":0.55},"1009":{"st":0.93,"sp":"C"},"1015":{"st":0.55},"1027":{"st":0.93,"sp":"P","n":"Goal threat from midfield"},"1003":{"st":0.93,"sp":"PC","rw":16.45},"1028":{"st":0.78,"sp":"C"},"1007":{"st":0.78,"sp":"C"},"1578":{"st":0.55},"1019":{"st":0.78},"1022":{"st":0.55},"591":{"st":0.78},"577":{"st":0.78},"575":{"st":0.78},"571":{"st":0.93,"sp":"CF","n":"Class above; Wolves midfielder"},"573":{"st":0.78},"570":{"st":0.78,"sp":"C"},"583":{"st":0.78,"sp":"P"},"582":{"st":0.78,"sp":"P"},"589":{"st":0.55,"sp":"C"},"590":{"st":0.55,"sp":"C"},"677":{"st":0.93},"665":{"st":0.78},"1454":{"st":0.93},"1455":{"st":0.35,"n":"Long knee injury history"},"662":{"st":0.78},"1457":{"st":0.78,"n":"Minor knock, expected fit"},"1458":{"st":0.93,"sp":"CF","n":"Main creator with Mitoma & Minamino out","rw":17.1},"682":{"st":0.78,"sp":"C"},"684":{"st":0.93},"669":{"st":0.78},"672":{"st":0.93,"sp":"P","n":"Strong projection at 7.0","rw":16.44},"673":{"st":0.55},"1514":{"st":0.55},"1518":{"st":0.93},"1121":{"st":0.55},"1113":{"st":0.78},"1125":{"st":0.78},"1520":{"st":0.93,"sp":"P","n":"Premium duo with Gyökeres"},"1124":{"st":0.93,"sp":"P","n":"Goal machine; shares pens"},"1185":{"st":0.93},"1551":{"st":0.93},"1552":{"st":0.78},"1166":{"st":0.78},"1160":{"st":0.78},"1555":{"st":0.78,"sp":"CF"},"1554":{"st":0.55},"1176":{"st":0.55},"451":{"st":0.78},"439":{"st":0.78},"438":{"st":0.78},"432":{"st":0.78},"434":{"st":0.78},"435":{"st":0.78},"447":{"st":0.78,"sp":"F"},"433":{"st":0.78,"sp":"C"},"1597":{"st":0.93,"sp":"PF","n":"Recovered from spring hamstring tear; sole pen taker, everything runs through him"},"445":{"st":0.93,"n":"Elite second scoring threat"},"620":{"st":0.93},"622":{"st":0.78},"600":{"st":0.55},"599":{"st":0.78},"626":{"st":0.78},"612":{"st":0.78,"sp":"CF"},"611":{"st":0.78,"sp":"C"},"627":{"st":0.55},"610":{"st":0.93,"sp":"P","n":"Talisman; pens"},"838":{"st":0.78},"1488":{"st":0.78},"830":{"st":0.78},"825":{"st":0.78},"826":{"st":0.55},"821":{"st":0.78},"1494":{"st":0.55,"sp":"C"},"1492":{"st":0.78},"823":{"st":0.78},"1493":{"st":0.93,"sp":"P","n":"All eggs in one basket - pens + every cross aimed at him"},"831":{"st":0.55},"236":{"st":0.93},"1963":{"st":0.93},"221":{"st":0.78},"1964":{"st":0.93},"1961":{"st":0.35,"n":"Hamstring - major doubt for opener ~June 12"},"220":{"st":0.78},"1967":{"st":0.93,"sp":"C"},"245":{"st":0.78,"sp":"C"},"242":{"st":0.78,"sp":"C"},"243":{"st":0.55,"sp":"C"},"226":{"st":0.93,"sp":"P","n":"Sole pen taker, host-nation talisman"},"227":{"st":0.78},"228":{"st":0.78},"1968":{"st":0.55,"sp":"C"},"1153":{"st":0.93},"1141":{"st":0.93,"rw":17.51},"1143":{"st":0.78,"n":"Cheap CB route 4.3","rw":17.5},"1142":{"st":0.78,"rw":16.83},"1145":{"st":0.78,"sp":"C"},"1144":{"st":0.55},"1135":{"st":0.93,"sp":"P","n":"Captain, pens"},"1138":{"st":0.78,"rw":16.88},"1137":{"st":0.78,"sp":"C","rw":17.96},"1140":{"st":0.78,"sp":"CF","n":"Set pieces; 6.2 value","rw":18.42},"1139":{"st":0.55,"sp":"C","n":"Back from injury"},"1149":{"st":0.93,"sp":"P","rw":18.09},"1158":{"st":0.78,"sp":"C","rw":17.29},"1151":{"st":0.78},"1582":{"st":0.55,"sp":"P"},"968":{"st":0.93},"949":{"st":0.78},"951":{"st":0.78},"952":{"st":0.55},"1506":{"st":0.78,"sp":"C"},"958":{"st":0.93,"sp":"PCF","n":"Everything runs through him"},"960":{"st":0.78,"sp":"C"},"959":{"st":0.93,"sp":"P"},"962":{"st":0.55,"sp":"C"},"153":{"st":0.93},"140":{"st":0.93,"sp":"C"},"142":{"st":0.78},"1341":{"st":0.78},"160":{"st":0.78,"sp":"C"},"161":{"st":0.78},"162":{"st":0.78,"sp":"P"},"152":{"st":0.78,"sp":"PCF","n":"Teenage Leverkusen talent on set pieces"},"150":{"st":0.55,"sp":"C"},"147":{"st":0.78,"sp":"P","n":"40 but still the focal point"},"146":{"st":0.93,"n":"Main goal threat"},"149":{"st":0.55},"423":{"st":0.78},"424":{"st":0.55},"404":{"st":0.78},"2053":{"st":0.93,"n":"Elite CB; ECU concede almost nothing"},"2052":{"st":0.93},"400":{"st":0.78,"sp":"C"},"403":{"st":0.78},"430":{"st":0.93,"n":"World-class anchor"},"428":{"st":0.78},"427":{"st":0.78,"sp":"PF","n":"Set pieces + pens share"},"412":{"st":0.78,"sp":"P"},"413":{"st":0.78,"sp":"C"},"414":{"st":0.55},"317":{"st":0.93},"301":{"st":0.78},"299":{"st":0.93},"300":{"st":0.78},"305":{"st":0.55},"322":{"st":0.93,"sp":"P"},"321":{"st":0.78},"323":{"st":0.55},"310":{"st":0.93,"sp":"CF","n":"Main creative outlet"},"311":{"st":0.78},"308":{"st":0.78,"sp":"P"},"368":{"st":0.93,"n":"Historic first WC for smallest nation ever"},"357":{"st":0.78},"359":{"st":0.78},"352":{"st":0.93,"sp":"PC","n":"Captain, set pieces"},"372":{"st":0.93,"sp":"CF","n":"Main quality"},"364":{"st":0.78},"363":{"st":0.78},"367":{"st":0.55},"350":{"st":0.78},"1563":{"st":0.93},"641":{"st":0.78},"642":{"st":0.78},"637":{"st":0.78},"644":{"st":0.78},"635":{"st":0.78,"sp":"CF"},"657":{"st":0.78,"sp":"C"},"650":{"st":0.55},"646":{"st":0.93,"sp":"P","n":"Physical focal point"},"649":{"st":0.78,"sp":"P"},"648":{"st":0.55},"1051":{"st":0.93},"1037":{"st":0.93},"1034":{"st":0.78},"1035":{"st":0.78},"1054":{"st":0.78},"1029":{"st":0.78},"1030":{"st":0.78},"1055":{"st":0.78,"sp":"C"},"1042":{"st":0.93},"1043":{"st":0.78},"1696":{"st":0.93,"sp":"PF","n":"Top-10 projection; pens","rw":19.82},"1041":{"st":0.78},"1":{"st":0.93},"2":{"st":0.93},"3":{"st":0.78},"2048":{"st":0.78},"2049":{"st":0.78},"24":{"st":0.78},"26":{"st":0.78},"11":{"st":0.93,"sp":"PCF","n":"Captain; all set pieces","rw":17.01},"9":{"st":0.93,"n":"Explosive form; elite differential 6.2","rw":17.55},"10":{"st":0.78,"sp":"P"},"98":{"st":0.93},"90":{"st":0.78},"88":{"st":0.78},"86":{"st":0.78},"85":{"st":0.55,"sp":"F","n":"Fitness managed all season"},"87":{"st":0.78},"106":{"st":0.93},"103":{"st":0.93},"111":{"st":0.78},"107":{"st":0.93,"sp":"CF","rw":17.26},"109":{"st":0.55},"95":{"st":0.78,"sp":"P","n":"Pens; strong projection","rw":17.94},"96":{"st":0.55},"709":{"st":0.93},"691":{"st":0.78},"690":{"st":0.78},"693":{"st":0.78},"689":{"st":0.78},"1546":{"st":0.78,"sp":"C"},"688":{"st":0.78},"701":{"st":0.93,"sp":"PCF","n":"The star - everything through him"},"1547":{"st":0.78,"sp":"P"},"262":{"st":0.93,"n":"Top GK projection at 4.3","rw":17.41},"248":{"st":0.93,"sp":"C"},"250":{"st":0.93},"249":{"st":0.78},"252":{"st":0.78},"253":{"st":0.55},"247":{"st":0.78},"265":{"st":0.78},"267":{"st":0.55,"sp":"F"},"270":{"st":0.93,"sp":"PCF","n":"Top-10 projection; all set pieces","rw":19.65},"256":{"st":0.93,"sp":"P","n":"Shares pens; elite winger"},"259":{"st":0.78,"n":"Projected starting 9","rw":16.94},"257":{"st":0.55},"289":{"st":0.93,"sp":"P","n":"GK who takes penalties!"},"274":{"st":0.93},"275":{"st":0.78},"273":{"st":0.78,"sp":"CF"},"1556":{"st":0.78},"295":{"st":0.78},"293":{"st":0.78},"294":{"st":0.78},"297":{"st":0.78,"sp":"C"},"284":{"st":0.78},"281":{"st":0.93,"n":"Premier League pedigree leads the line"},"283":{"st":0.78,"sp":"P"},"285":{"st":0.55},"1312":{"st":0.93},"1293":{"st":0.93,"n":"Man City CB - class apart"},"1294":{"st":0.78},"1296":{"st":0.78},"1284":{"st":0.78,"sp":"P"},"1291":{"st":0.78,"sp":"C"},"1292":{"st":0.93,"sp":"CF","n":"The creative star"},"1306":{"st":0.93,"sp":"P"},"1307":{"st":0.55},"1971":{"st":0.93},"1981":{"st":0.78},"1980":{"st":0.78},"1983":{"st":0.78},"1984":{"st":0.78},"1992":{"st":0.93,"sp":"P","n":"Premier League form star"},"1986":{"st":0.78,"sp":"PC"},"1987":{"st":0.78},"885":{"st":0.93},"870":{"st":0.93},"2026":{"st":0.78},"865":{"st":0.78},"872":{"st":0.55,"sp":"F"},"887":{"st":0.93,"sp":"PCF","n":"The conductor - all set pieces"},"869":{"st":0.78},"866":{"st":0.78,"sp":"C"},"879":{"st":0.78,"sp":"P"},"880":{"st":0.78,"sp":"P"},"881":{"st":0.55},"1077":{"st":0.93,"n":"Pen-saving specialist GK"},"1065":{"st":0.78},"1063":{"st":0.78,"sp":"C"},"1066":{"st":0.78},"1058":{"st":0.93,"sp":"CF"},"1062":{"st":0.78},"1072":{"st":0.78,"sp":"C","n":"Teen star"},"1073":{"st":0.93,"sp":"PC"},"1061":{"st":0.55,"sp":"C"},"1071":{"st":0.93,"sp":"P"},"1075":{"st":0.55},"729":{"st":0.93},"715":{"st":0.93,"n":"World-class CB anchor"},"720":{"st":0.78,"sp":"C","n":"3.7 DEF with set-piece involvement","rw":16.48},"716":{"st":0.78},"1549":{"st":0.93,"sp":"C"},"732":{"st":0.78,"sp":"F"},"736":{"st":0.93,"sp":"C","n":"Main creator","rw":16.39},"737":{"st":0.78},"723":{"st":0.93,"sp":"PCF","n":"Captain; pens + FKs"},"724":{"st":0.78,"sp":"P"},"726":{"st":0.55},"725":{"st":0.55,"n":"Knee history"},"1400":{"st":0.93},"380":{"st":0.93,"sp":"C"},"378":{"st":0.78},"376":{"st":0.78,"sp":"C"},"374":{"st":0.78},"393":{"st":0.93,"sp":"P","n":"Set-piece header threat"},"395":{"st":0.78,"sp":"C"},"396":{"st":0.78,"sp":"CF"},"397":{"st":0.93,"sp":"C"},"382":{"st":0.93,"sp":"P","n":"Elite finisher; pens"},"1427":{"st":0.78},"383":{"st":0.55,"sp":"P"},"1001":{"st":0.93},"983":{"st":0.78},"1951":{"st":0.78},"978":{"st":0.78,"sp":"F"},"1957":{"st":0.78},"972":{"st":0.78,"sp":"C"},"1955":{"st":0.93,"sp":"PCF","n":"The talisman; all set pieces"},"995":{"st":0.55},"1244":{"st":0.93},"1226":{"st":0.78},"1227":{"st":0.78},"1229":{"st":0.55},"1230":{"st":0.55},"1224":{"st":0.78},"1248":{"st":0.93,"sp":"CF","n":"Captain; long-range threat"},"2064":{"st":0.78},"1247":{"st":0.78,"sp":"P"},"1223":{"st":0.78,"sp":"C","n":"6.4 value pick","rw":16.77},"1222":{"st":0.55},"1237":{"st":0.78,"n":"Projected starter over Núñez per projections","rw":17.31},"1236":{"st":0.55,"sp":"P","n":"Rotation risk despite pedigree"},"214":{"st":0.93,"n":"Historic debut for the islanders"},"201":{"st":0.93},"1529":{"st":0.35,"n":"Returning from ACL"},"205":{"st":0.78},"203":{"st":0.78},"1530":{"st":0.93,"sp":"PCF","n":"The conductor"},"208":{"st":0.78},"218":{"st":0.78,"sp":"C"},"217":{"st":0.78},"206":{"st":0.93,"sp":"PF","n":"Captain and talisman"},"211":{"st":0.78},"210":{"st":0.55}};
const TEAM_META = {"1":{"elo":1760,"prog":"R16"},"2":{"elo":2114,"prog":"TITLE"},"3":{"elo":1777,"prog":"R32"},"4":{"elo":1830,"prog":"R16"},"5":{"elo":1894,"prog":"QF"},"6":{"elo":1595,"prog":"R32"},"7":{"elo":1991,"prog":"SF"},"8":{"elo":1578,"prog":"R32"},"9":{"elo":1788,"prog":"R32"},"10":{"elo":1982,"prog":"QF"},"11":{"elo":1652,"prog":"R32"},"12":{"elo":1695,"prog":"R16"},"13":{"elo":1912,"prog":"QF"},"14":{"elo":1434,"prog":"R32"},"15":{"elo":1740,"prog":"R16"},"16":{"elo":1938,"prog":"R16"},"17":{"elo":1696,"prog":"R16"},"18":{"elo":2021,"prog":"TITLE"},"19":{"elo":2063,"prog":"TITLE"},"20":{"elo":1932,"prog":"SF"},"21":{"elo":1510,"prog":"R32"},"22":{"elo":1548,"prog":"R32"},"23":{"elo":1772,"prog":"R32"},"24":{"elo":1618,"prog":"R32"},"25":{"elo":1906,"prog":"R16"},"26":{"elo":1680,"prog":"R32"},"27":{"elo":1758,"prog":"R16"},"28":{"elo":1875,"prog":"R16"},"29":{"elo":1827,"prog":"QF"},"30":{"elo":1948,"prog":"QF"},"31":{"elo":1562,"prog":"R32"},"32":{"elo":1914,"prog":"QF"},"33":{"elo":1730,"prog":"R32"},"34":{"elo":1834,"prog":"R32"},"35":{"elo":1986,"prog":"SF"},"36":{"elo":1421,"prog":"R32"},"37":{"elo":1576,"prog":"R32"},"38":{"elo":853,"prog":"R16"},"39":{"elo":1860,"prog":"R16"},"40":{"elo":1517,"prog":"R32"},"41":{"elo":2157,"prog":"TITLE"},"42":{"elo":1712,"prog":"R16"},"43":{"elo":1891,"prog":"R16"},"44":{"elo":1628,"prog":"R32"},"45":{"elo":1911,"prog":"R16"},"46":{"elo":1892,"prog":"QF"},"47":{"elo":1726,"prog":"R16"},"48":{"elo":1714,"prog":"R32"}};
const COACH_MODE = "off";
const WAITLIST_URL = "https://tally.so/r/b5zb67";
const APP_VERSION = "1.1.0";       // bump on every change; surfaced in the header + footer so changes are trackable
const APP_UPDATED = "2026-06-12";  // last feature/content update (YYYY-MM-DD)
const store = {
  async get(k){ try{ const v=localStorage.getItem(k); return v!=null?{value:v}:null; }catch(e){ return null; } },
  async set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} },
};
const SNAP = {"p":[[1,"Rayan Aït-Nouri",1,1,4.9,1.1],[2,"Ramy Bensebaini",1,1,4.4,0.2],[3,"Aïssa Mandi",1,1,3.9,0.1],[5,"Zinéddine Belaïd",1,1,3.7,0],[7,"Rafik Belghali",1,1,3.5,1.6],[8,"Achref Abada",1,1,3.5,0.5],[9,"Mohammed Amoura",1,3,6.2,0.1],[10,"Amine Gouiri",1,3,6.2,0.1],[11,"Riyad Mahrez",1,2,6.5,0.7],[12,"Ibrahim Maza",1,3,5.4,0.2],[13,"Anis Hadj Moussa",1,3,5.3,0.1],[14,"Farès Ghedjemis",1,3,4.4,0],[15,"Ahmed Benbouali",1,3,4.2,0],[18,"Luca Zidane",1,0,3.8,1],[19,"Melvin Mastil",1,0,3.5,2.1],[21,"Adil Boulbina",1,2,4,2.4],[22,"Yacine Titraoui",1,2,4.7,0],[23,"Ramiz Zerrouki",1,2,5.3,0],[24,"Hicham Boudaoui",1,2,5.5,0],[26,"Houssem Aouar",1,2,6,0.2],[27,"Farès Chaïbi",1,2,6.2,0],[28,"Cristian Romero",2,1,4.9,4.9],[30,"Nahuel Molina",2,1,4.4,3.6],[31,"Nicolás Otamendi",2,1,4.4,2.2],[34,"Nicolás Tagliafico",2,1,4.3,1.2],[38,"Lionel Messi",2,3,10,17.1],[39,"Julián Alvarez",2,3,8.6,16.1],[41,"Giuliano Simeone",2,2,5.6,0.7],[42,"Nico González",2,2,5.6,0.1],[43,"José Manuel López",2,3,5.3,0.1],[45,"Emiliano Martínez",2,0,5,21.9],[46,"Gerónimo Rulli",2,0,4.5,0.2],[47,"Juan Musso",2,0,4.3,0.1],[48,"Leandro Paredes",2,2,5.6,0.2],[50,"Rodrigo De Paul",2,2,5.9,0.9],[51,"Nico Paz",2,2,5.9,1.4],[53,"Valentín Barco",2,2,6.2,0.1],[54,"Exequiel Palacios",2,2,6,0.2],[55,"Thiago Almada",2,2,6.5,0.3],[56,"Alexis Mac Allister",2,2,6.6,3.3],[57,"Enzo Fernández",2,2,7.5,3.3],[58,"Jordan Bos",3,1,4,0.5],[60,"Alessandro Circati",3,1,3.9,0.1],[61,"Cameron Burgess",3,1,3.8,0.1],[62,"Milos Degenek",3,1,3.8,0],[63,"Aziz Behich",3,1,3.8,0],[64,"Jason Geria",3,1,3.7,0],[66,"Kai Trewin",3,1,3.5,0.5],[67,"Lucas Herrington",3,1,3.5,0.3],[68,"Nestory Irankunda",3,3,5.1,0.3],[70,"Nishan Velupillay",3,3,4.4,0],[72,"Jacob Italiano",3,1,4.2,0.1],[74,"Mathew Ryan",3,0,4.1,0.7],[75,"Paul Izzo",3,0,3.6,0.1],[76,"Patrick Beach",3,0,3.5,1],[77,"Paul Okon",3,2,4.7,0],[80,"Connor Metcalfe",3,2,5.3,0],[81,"Aiden O'Neill",3,2,5.4,0.1],[82,"Awer Mabil",3,2,5.6,0],[83,"Ajdin Hrustic",3,2,5.7,0],[85,"David Alaba",4,1,4.6,2.2],[86,"Philipp Lienhart",4,1,4.3,0.2],[87,"Alexander Prass",4,1,4.3,0],[88,"Kevin Danso",4,1,4.3,0.5],[90,"Stefan Posch",4,1,4.3,0.4],[91,"Phillipp Mwene",4,1,3.9,0],[92,"Marco Friedl",4,1,4.3,0],[93,"David Affengruber",4,1,3.9,0],[94,"Michael Svoboda",4,1,3.8,0],[95,"Marko Arnautovic",4,3,6,0.6],[96,"Michael Gregoritsch",4,3,6,0.2],[97,"Sasa Kalajdzic",4,3,6,0.2],[98,"Alexander Schlager",4,0,4.6,0.4],[99,"Patrick Pentz",4,0,4.6,0.1],[101,"Florian Wiegele",4,0,3.5,0.3],[102,"Carney Chukwuemeka",4,2,5,1],[103,"Konrad Laimer",4,2,5.8,0.4],[104,"Alessandro Schöpf",4,2,5.3,0],[105,"Florian Grillitsch",4,2,5.5,0],[106,"Nicolas Seiwald",4,2,5.6,0],[107,"Marcel Sabitzer",4,2,6.8,3.4],[108,"Romano Schmid",4,2,6,0.1],[109,"Patrick Wimmer",4,2,6,0.1],[110,"Paul Wanner",4,2,5.6,0],[111,"Xaver Schlager",4,2,5.5,0],[114,"Maxim De Cuyper",5,1,4.7,4.2],[115,"Timothy Castagne",5,1,4.7,0.4],[116,"Arthur Theate",5,1,4.5,0.3],[117,"Thomas Meunier",5,1,4.8,0.8],[118,"Zeno Debast",5,1,4.3,0.2],[119,"Axel Witsel",5,2,5,1.1],[120,"Koni De Winter",5,1,4.2,0.1],[121,"Brandon Mechele",5,1,3.9,0.1],[122,"Joaquin Seys",5,1,3.9,0.1],[123,"Nathan Ngoy",5,1,3.7,0.3],[124,"Romelu Lukaku",5,3,7.4,2.1],[125,"Jérémy Doku",5,2,7.5,13.4],[127,"Dodi Lukébakio",5,3,5.9,0.1],[128,"Alexis Saelemaekers",5,2,5.7,0.1],[129,"Charles De Ketelaere",5,2,5.6,1],[132,"Senne Lammens",5,0,4.6,1.7],[135,"Nicolas Raskin",5,2,5.3,0.1],[136,"Amadou Onana",5,2,5.9,0.3],[137,"Youri Tielemans",5,2,6.1,1.2],[138,"Kevin De Bruyne",5,2,7.5,5.5],[139,"Sead Kolasinac",6,1,4.3,0.2],[140,"Amar Dedic",6,1,4.3,0.4],[141,"Tarik Muharemovic",6,1,3.9,0.3],[142,"Nikola Katic",6,1,3.8,0.2],[143,"Stjepan Radeljic",6,1,3.7,0],[144,"Nihad Mujakic",6,1,3.6,0.1],[145,"Nidal Celik",6,1,3.5,0.5],[146,"Ermedin Demirovic",6,3,6.2,0.1],[147,"Edin Dzeko",6,3,6.1,1],[148,"Jovo Lukic",6,3,5.6,0],[149,"Haris Tabakovic",6,3,5.1,0.1],[150,"Esmir Bajraktarevic",6,3,4.7,0.2],[151,"Samed Bazdar",6,3,4.5,0],[152,"Kerim Alajbegovic",6,3,4.2,0.3],[153,"Nikola Vasilj",6,0,4,0.7],[155,"Martin Zlomislic",6,0,3.5,0.3],[156,"Amar Memic",6,2,4.7,0.1],[157,"Dzenis Burnic",6,2,4.9,0],[158,"Ivan Sunjic",6,2,5.1,0],[159,"Armin Gigovic",6,2,5.1,0],[160,"Ivan Basic",6,2,5.1,0],[161,"Benjamin Tahirovic",6,2,5.3,0.1],[162,"Amir Hadziahmetovic",6,2,5.5,0.1],[164,"Gabriel Magalhães",7,1,5.5,21.8],[165,"Marquinhos",7,1,5.2,7.3],[166,"Ibañez",7,1,4.4,0.2],[167,"Danilo",7,1,4.3,0.7],[168,"Douglas Santos",7,1,4.3,0.3],[169,"Bremer",7,1,4.3,0.5],[170,"Léo Pereira",7,1,4.2,0.1],[173,"Vinícius Júnior",7,2,10,13.2],[174,"Matheus Cunha",7,3,7.3,3.4],[176,"Gabriel Martinelli",7,2,6.5,0.7],[177,"Luiz Henrique",7,3,6.1,0.2],[178,"Igor Thiago",7,3,5.9,2.6],[179,"Rayan",7,3,5.6,0.2],[181,"Endrick",7,3,5.5,2.5],[182,"Ederson",7,0,5,3.3],[183,"Alisson Becker",7,0,5,5.2],[186,"Fabinho",7,2,5.2,0.3],[187,"Danilo",7,2,5.6,0.2],[188,"Casemiro",7,2,6.3,2.1],[190,"Lucas Paquetá",7,2,6.5,0.5],[195,"João Paulo",8,2,4.6,0.1],[196,"Yannick Semedo",8,2,4.7,0],[198,"Kevin Pina",8,2,4.7,0],[199,"Steven Moreira",8,1,3.9,0],[200,"Wagner Pina",8,1,3.8,0],[201,"Pico",8,1,3.7,0],[202,"Kelvin Pires",8,1,3.6,0],[203,"Sidny Cabral",8,1,3.5,0.2],[205,"Diney",8,1,3.5,0.1],[206,"Ryan Mendes",8,3,4.9,0.1],[207,"Jovane Cabral",8,3,4.9,0.1],[208,"Dailon Livramento",8,3,4.9,0.1],[209,"Nuno da Costa",8,3,4.7,0],[210,"Garry Rodrigues",8,3,4.7,0],[211,"Willy Semedo",8,3,4.5,0],[214,"Vozinha",8,0,3.9,0.1],[215,"CJ dos Santos",8,0,3.6,0],[216,"Márcio da Rosa",8,0,3.5,0.2],[217,"Telmo Arcanjo",8,2,4.9,0],[218,"Deroy Duarte",8,2,4.9,0],[219,"Laros Duarte",8,2,5.1,0],[220,"Richie Laryea",9,1,3.9,0.1],[221,"Derek Cornelius",9,1,4,0.4],[223,"Joel Waterman",9,1,3.7,0.1],[225,"Luc De Fougerolles",9,1,3.5,0.4],[226,"Jonathan David",9,3,7,1.2],[227,"Cyle Larin",9,3,6.2,0.1],[228,"Tajon Buchanan",9,3,5.5,0.1],[229,"Liam Millar",9,3,5.1,0.1],[230,"Tani Oluwaseyi",9,3,4.9,0.1],[235,"Maxime Crépeau",9,0,4,3.1],[236,"Dayne St. Clair",9,0,3.8,0.4],[237,"Owen Goodman",9,0,3.5,0.6],[238,"Ali Ahmed",9,2,4.9,0.1],[240,"Niko Sigur",9,2,4.9,0],[241,"Nathan Saliba",9,2,5.1,0.1],[242,"Mathieu Choinière",9,2,5.3,0],[243,"Jonathan Osorio",9,2,5.6,0],[245,"Ismaël Koné",9,2,6,0.3],[246,"Kevin Castaño",10,2,4.3,0.2],[247,"Richard Ríos",10,2,4.7,0.6],[248,"Daniel Muñoz",10,1,4.6,8.4],[249,"Jhon Lucumí",10,1,4.3,0.2],[250,"Dávinson Sánchez",10,1,4.3,0.9],[251,"Déiver Machado",10,1,3.9,0.1],[252,"Johan Mojica",10,1,3.9,4.6],[253,"Santiago Arias",10,1,3.9,0.1],[256,"Luis Díaz",10,2,8.1,18.4],[257,"Jhon Córdoba",10,3,6.1,0.1],[259,"Luis Suárez",10,3,5.7,2.6],[261,"Andrés Gómez",10,3,4.9,0.2],[262,"Camilo Vargas",10,0,4.3,3.6],[263,"David Ospina",10,0,4,1.1],[264,"Álvaro Montero",10,0,3.8,0.1],[265,"Jefferson Lerma",10,2,4.9,0.2],[266,"Gustavo Puerta",10,2,5.3,0],[267,"Juan Fernando Quintero",10,2,5.6,0.1],[268,"Jaminton Campaz",10,2,5.5,0],[269,"Jhon Arias",10,2,6.3,0.4],[270,"James Rodríguez",10,2,6.5,4.6],[271,"Jorge Carrascal",10,2,6.1,0.1],[272,"Aaron Wan-Bissaka",11,1,4.3,0.6],[273,"Arthur Masuaku",11,1,4.2,0],[274,"Chancel Mbemba",11,1,4.2,0.1],[275,"Axel Tuanzebe",11,1,4,0.4],[276,"Joris Kayembe",11,1,3.9,0],[277,"Dylan Batubinsika",11,1,3.8,0],[278,"Steve Kapuadi",11,1,3.7,0],[281,"Yoane Wissa",11,3,6.2,0.2],[282,"Simon Banza",11,3,5.6,0],[283,"Cédric Bakambu",11,3,6.5,0.1],[284,"Meschack Elia",11,3,4.9,0.1],[285,"Fiston Mayele",11,3,4.9,0.1],[287,"Nathanaël Mbuku",11,3,4.5,0],[288,"Brian Cipenga",11,3,4.2,0],[289,"Lionel Mpasi",11,0,4,0.2],[290,"Matthieu Epolo",11,0,3.7,0.1],[291,"Timothy Fayulu",11,0,3.6,0],[292,"Ngal'ayel Mukau",11,2,4.9,0],[293,"Samuel Moutoussamy",11,2,5.1,0],[294,"Noah Sadiki",11,2,5.3,0.1],[295,"Charles Pickel",11,2,5.3,0],[296,"Edo Kayembe",11,2,5.6,0],[297,"Théo Bongonda",11,2,6.2,0],[298,"Christ Inao Oulaï",12,2,4.6,0.1],[299,"Evan Ndicka",12,1,4.4,0.3],[300,"Wilfried Singo",12,1,4.4,0.2],[301,"Ousmane Diomande",12,1,4.3,0.4],[302,"Odilon Kossounou",12,1,4.3,0],[303,"Guéla Doué",12,1,3.9,1],[304,"Emmanuel Agbadou",12,1,3.9,0.1],[305,"Ghislain Konan",12,1,4,0.3],[307,"Yan Diomande",12,3,5.9,1.2],[308,"Nicolas Pépé",12,3,5.9,0.2],[309,"Elye Wahi",12,3,5.9,0],[310,"Amad Diallo",12,3,5.9,0.7],[311,"Simon Adingra",12,3,5.6,0.1],[312,"Evann Guessand",12,3,5.3,0.1],[314,"Bazoumana Touré",12,3,4.5,0.2],[316,"Alban Lafont",12,0,4.1,0.2],[317,"Yahia Fofana",12,0,4.2,0.3],[318,"Mohamed Koné",12,0,3.7,0.1],[319,"Parfait Guiagon",12,2,4.9,0],[320,"Jean Michaël Seri",12,2,5.5,0],[321,"Ibrahim Sangaré",12,2,5.8,0.1],[322,"Franck Kessie",12,2,5.9,0.1],[323,"Seko Fofana",12,2,6.8,0.2],[324,"Petar Sucic",13,2,4.2,0.8],[325,"Josip Stanisic",13,1,4.3,0.5],[326,"Josip Sutalo",13,1,4.3,0],[327,"Duje Caleta-Car",13,1,4,0.3],[328,"Marin Pongracic",13,1,4,0.3],[329,"Martin Erlic",13,1,3.9,0],[330,"Luka Vuskovic",13,1,3.7,1.2],[332,"Ante Budimir",13,3,6.8,0.2],[333,"Andrej Kramaric",13,3,6.2,0.2],[334,"Ivan Perisic",13,3,5.4,0.5],[335,"Marco Pasalic",13,3,5.3,0.1],[336,"Petar Musa",13,3,5.1,0.1],[337,"Igor Matanovic",13,3,4.9,0.1],[338,"Dominik Livakovic",13,0,4.5,1.5],[339,"Ivor Pandur",13,0,3.9,0.1],[341,"Luka Sucic",13,2,4.9,0.1],[342,"Toni Fruk",13,2,4.9,0],[343,"Nikola Moro",13,2,5.6,0],[344,"Kristijan Jakic",13,2,5.6,0],[345,"Nikola Vlasic",13,2,6.1,0],[346,"Luka Modric",13,2,6.2,2.6],[347,"Mario Pasalic",13,2,6.4,0.1],[348,"Martin Baturina",13,2,6.5,0.2],[350,"Tahith Chong",14,2,4.2,0.5],[351,"Godfried Roemeratoe",14,2,4.7,0],[352,"Leandro Bacuna",14,1,4,0.3],[353,"Riechedly Bazoer",14,1,3.8,0],[354,"Joshua Brenet",14,1,3.7,0],[355,"Shurandy Sambo",14,1,3.6,0],[356,"Sherel Floranus",14,1,3.6,0],[357,"Roshon van Eijma",14,1,3.5,0.1],[358,"Ar'Jany Martha",14,1,3.5,0.1],[359,"Juriën Gaari",14,1,3.5,0],[360,"Livano Comenencia",14,1,4.5,0],[361,"Tyrese Noslin",14,1,3.5,0],[362,"Brandley Kuwas",14,3,4.4,0],[363,"Sontje Hansen",14,3,4.4,0],[364,"Kenji Gorré",14,3,4.2,0],[365,"Jearl Margaritha",14,3,4.2,0],[366,"Gervane Kastaneer",14,3,4,0.4],[367,"Jeremy Antonisse",14,3,4,0.1],[368,"Eloy Room",14,0,3.9,0.1],[369,"Trevor Doornbusch",14,0,3.6,0],[370,"Tyrick Bodak",14,0,3.5,0.2],[371,"Kevin Felida",14,2,4.5,0],[372,"Juninho Bacuna",14,2,5.1,0],[373,"Denis Visinsky",15,2,4.9,0],[374,"Ladislav Krejcí",15,1,4.4,0.5],[375,"Tomás Holes",15,1,3.9,0],[376,"David Jurásek",15,1,3.9,0],[378,"Robin Hranác",15,1,3.9,0],[379,"Jaroslav Zeleny",15,1,3.9,0],[380,"Vladimír Coufal",15,1,3.6,3.3],[381,"Stepán Chaloupek",15,1,3.5,0.2],[382,"Patrik Schick",15,3,7.3,0.8],[383,"Tomás Chory",15,3,5.3,0],[384,"Mojmír Chytil",15,3,4.9,0.1],[387,"Matej Kovár",15,0,4.1,0.4],[388,"Lukás Hornícek",15,0,3.8,0.1],[390,"Lukás Cerv",15,2,5.3,0],[391,"Vladimír Darida",15,2,5.3,0],[393,"Tomás Soucek",15,2,5.6,0.5],[395,"Michal Sadílek",15,2,5.6,0],[396,"Lukás Provod",15,2,5.9,0],[397,"Pavel Sulc",15,2,5.9,0.2],[398,"Denil Castillo",16,2,4.9,0],[399,"Jordy Alcívar",16,2,4.9,0],[400,"Pervis Estupiñán",16,1,4.8,2.6],[403,"Ángelo Preciado",16,1,4.3,0.1],[404,"Joel Ordóñez",16,1,3.9,0.9],[405,"Félix Torres",16,1,3.9,0.1],[407,"Jackson Porozo",16,1,3.8,0],[411,"Yaimar Medina",16,1,3.5,0.5],[412,"Enner Valencia",16,3,5.9,0.6],[413,"Gonzalo Plata",16,3,5.6,0.1],[414,"John Yeboah",16,2,5.1,0.1],[415,"Kevin Rodríguez",16,3,4.9,0.2],[416,"Alan Minda",16,3,4.9,0.1],[417,"Jordy Caicedo",16,3,4.9,0.1],[420,"Anthony Valencia",16,2,4.2,0.5],[421,"Jeremy Arévalo",16,3,4,0.3],[423,"Hernán Galíndez",16,0,4.2,4.3],[424,"Moisés Ramírez",16,0,3.9,0.1],[425,"Gonzalo Valle",16,0,3.6,0.1],[427,"Kendry Páez",16,2,5.2,0.1],[428,"Alan Franco",16,2,5.6,0],[429,"Pedro Vite",16,2,5.2,0],[430,"Moisés Caicedo",16,2,6.8,1.6],[432,"Marwan Attia",17,2,4.3,0.1],[433,"Zizo",17,2,4.3,0.3],[434,"Hamdi Fathy",17,2,4.4,0.1],[435,"Emam Ashour",17,2,4.6,0.4],[436,"Mahmoud Saber",17,2,4.9,0],[437,"Mohamed Abdelmonem",17,1,4,0.4],[438,"Ahmed Fatouh",17,1,3.9,0.2],[439,"Mohamed Hany",17,1,3.6,0.4],[440,"Ramy Rabia",17,1,3.6,0.1],[441,"Hossam Abdelmaguid",17,1,3.6,0],[442,"Tarek Alaa",17,1,3.5,0.1],[444,"Yasser Ibrahim",17,1,3.5,0.4],[445,"Omar Marmoush",17,3,7.8,2],[447,"Trezeguet",17,3,5.6,0.1],[448,"Haissem Hassan",17,3,4.6,0.1],[451,"Mohamed El Shenawy",17,0,3.6,0.4],[452,"El Mahdy Soliman",17,0,3.6,0],[453,"Mostafa Shobeir",17,0,3.5,1.5],[454,"Mohamed Alaa",17,0,3.5,0.1],[455,"Mohanad Lasheen",17,2,5.3,0],[456,"Ibrahim Adel",17,2,5.9,0],[457,"Nico O'Reilly",18,1,4.7,12.1],[459,"Tino Livramento",18,1,4.6,0.3],[461,"Marc Guéhi",18,1,5.1,7.9],[462,"Dan Burn",18,1,4.5,0.4],[463,"Ezri Konsa",18,1,4.8,1.1],[466,"John Stones",18,1,4.6,1.2],[467,"Djed Spence",18,1,4.5,0.4],[468,"Harry Kane",18,3,10.5,37.3],[469,"Bukayo Saka",18,2,9.5,5.5],[471,"Marcus Rashford",18,2,7.5,2.2],[474,"Anthony Gordon",18,2,7,0.9],[475,"Morgan Rogers",18,2,7.2,0.9],[476,"Noni Madueke",18,3,6.1,0.3],[477,"Jordan Pickford",18,0,4.8,14.9],[478,"Dean Henderson",18,0,4.2,0.3],[479,"James Trafford",18,0,4,0.5],[482,"Jordan Henderson",18,2,5.1,0.2],[485,"Kobbie Mainoo",18,2,6.1,0.6],[486,"Elliot Anderson",18,2,6.5,0.9],[488,"Declan Rice",18,2,7,6.8],[491,"Jude Bellingham",18,2,8.3,9.1],[492,"Theo Hernández",19,1,5,3.3],[493,"Maxence Lacroix",19,1,4.5,0.4],[494,"Dayot Upamecano",19,1,5.3,4.5],[495,"Ibrahima Konaté",19,1,4.9,1.9],[496,"Lucas Hernández",19,1,5.2,2.5],[498,"Lucas Digne",19,1,5,1.1],[499,"Malo Gusto",19,1,5.1,0.5],[500,"Kylian Mbappé",19,3,10.5,49.6],[501,"Ousmane Dembélé",19,2,10,17.8],[502,"Marcus Thuram",19,3,7.5,0.6],[505,"Désiré Doué",19,2,7.5,3.3],[506,"Mike Maignan",19,0,5,9.5],[508,"Brice Samba",19,0,4.5,0.2],[509,"N'Golo Kanté",19,2,5.1,1],[510,"Adrien Rabiot",19,2,6.4,0.3],[511,"Warren Zaïre-Emery",19,2,6.1,0.3],[512,"Manu Koné",19,2,6.1,0.1],[514,"Maghnes Akliouche",19,2,6.4,0],[515,"Aurélien Tchouaméni",19,2,6.5,0.9],[516,"Rayan Cherki",19,2,8,7.5],[517,"Michael Olise",19,2,9.5,29.7],[519,"Angelo Stiller",20,2,5.8,0.2],[520,"Antonio Rüdiger",20,1,5.5,10.3],[521,"David Raum",20,1,4.9,3],[522,"Malick Thiaw",20,1,4.7,0.8],[523,"Jonathan Tah",20,1,5.3,4.3],[525,"Nathaniel Brown",20,1,4.7,0.5],[526,"Nico Schlotterbeck",20,1,5.3,3.9],[527,"Waldemar Anton",20,1,3.9,0.2],[528,"Kai Havertz",20,3,7.8,13.7],[529,"Leroy Sané",20,2,7.4,1.5],[531,"Deniz Undav",20,3,6.6,0.9],[532,"Nick Woltemade",20,3,7.2,1.3],[533,"Alexander Nübel",20,0,4.7,0.4],[534,"Oliver Baumann",20,0,4.3,0.3],[538,"Pascal Groß",20,2,5.6,0.2],[540,"Leon Goretzka",20,2,6.1,0.4],[542,"Joshua Kimmich",20,1,5.5,31.8],[543,"Florian Wirtz",20,2,7.5,22.9],[565,"Benjamin Asare",21,0,3.8,0.1],[569,"Woodensky Pierre",22,2,4.2,0],[570,"Leverton Pierre",22,2,4.2,0],[571,"Jean-Ricner Bellegarde",22,2,4.7,0.1],[572,"Carl Sainté",22,2,4.7,0],[573,"Danley Jean Jacques",22,2,4.7,0],[574,"Jean-Kévin Duverne",22,1,3.8,0],[575,"Carlens Arcus",22,1,3.8,0],[576,"Hannes Delcroix",22,1,3.7,0],[577,"Ricardo Adé",22,1,3.5,0.1],[578,"Martin Expérience",22,1,3.5,0.1],[580,"Wilguens Paugain",22,1,3.5,0],[581,"Duke Lacroix",22,1,3.5,0.4],[582,"Wilson Isidor",22,3,5,1.3],[583,"Duckens Nazon",22,3,6,0.2],[584,"Frantzdy Pierrot",22,3,4.7,0],[585,"Derrick Etienne",22,3,4.4,0],[586,"Louicius Deedson",22,3,4.2,0],[588,"Yassin Fortuné",22,3,4.2,0],[589,"Josué Casimir",22,3,4.2,0],[590,"Ruben Providence",22,3,4,0.1],[591,"Johny Placide",22,0,3.9,0.1],[592,"Alexandre Pierre",22,0,3.6,0],[593,"Josué Duverger",22,0,3.5,0.1],[594,"Amir Mohammad Razzaghinia",23,2,4.2,0.1],[596,"Mohammad Ghorbani",23,2,5.1,0],[597,"Ramin Rezaeian",23,1,4,0.4],[598,"Hossein Kanani",23,1,3.9,0],[599,"Milad Mohammadi",23,1,3.8,0],[600,"Shoja Khalilzadeh",23,1,3.8,0],[601,"Ehsan Hajisafi",23,1,3.7,0],[603,"Saleh Hardani",23,1,3.7,0],[606,"Ali Nemati",23,1,3.5,0.1],[608,"Aria Yousefi",23,1,3.5,0.1],[609,"Danial Eiri",23,1,3.5,0],[610,"Mehdi Taremi",23,3,6.1,0.6],[611,"Alireza Jahanbakhsh",23,3,5.3,0],[612,"Saman Ghoddos",23,3,4.9,0.1],[614,"Ali Alipour",23,3,4.6,0],[615,"Dennis Dargahi",23,3,4.6,0],[616,"Amirhossein Hosseinzadeh",23,3,4.5,0],[620,"Alireza Beiranvand",23,0,4.2,0.2],[621,"Payam Niazmand",23,0,3.9,0],[622,"Hossein Hosseini",23,0,3.8,0],[625,"Mehdi Torabi",23,2,5.6,0],[626,"Saeid Ezatolahi",23,2,5.6,0],[627,"Mohammad Mohebi",23,2,5.9,0],[629,"Mehdi Ghayedi",23,2,5.9,0],[630,"Zaid Ismael",24,2,4.4,0],[631,"Marko Farji",24,2,4.4,0],[634,"Kevin Yakob",24,2,5.1,0],[635,"Amir Al Ammari",24,2,5.3,0],[636,"Aimar Sher",24,2,5.3,0],[637,"Merchas Doski",24,1,3.8,0.1],[638,"Frans Putros",24,1,3.7,0],[639,"Rebin Sulaka",24,1,3.7,0],[641,"Hussein Ali",24,1,3.6,0],[642,"Zaid Tahseen",24,1,3.6,0],[643,"Munaf Younus",24,1,3.5,0],[644,"Akam Hashim",24,1,3.5,0.1],[645,"Ahmed Maknzi",24,1,3.5,0],[646,"Aymen Hussein",24,3,5.3,0.1],[647,"Mohanad Ali",24,3,4.9,0.1],[648,"Ali Jasim",24,3,4.9,0.1],[649,"Ali Al Hamadi",24,3,4.7,0],[650,"Youssef Amyn",24,3,4.4,0],[651,"Ali Yousif",24,3,4.2,0],[653,"Ahmed Basil",24,0,3.8,0],[654,"Fahad Talib",24,0,3.7,0],[656,"Zidane Iqbal",24,2,5.6,0.1],[657,"Ibrahim Bayesh",24,2,5.6,0],[659,"Kaishu Sano",25,2,4.9,0.1],[662,"Yukinari Sugawara",25,1,4.4,0.2],[663,"Tsuyoshi Watanabe",25,1,4.3,0.1],[665,"Hiroki Ito",25,1,3.9,0.4],[666,"Shogo Taniguchi",25,1,3.9,0],[667,"Ayumu Seko",25,1,3.8,0.1],[668,"Junnosuke Suzuki",25,1,3.5,0.8],[669,"Junya Ito",25,2,5,1.4],[670,"Daizen Maeda",25,2,5,1.2],[671,"Keito Nakamura",25,2,5.5,0.2],[672,"Ayase Ueda",25,3,7,0.7],[673,"Koki Ogawa",25,3,4.9,0.2],[675,"Keisuke Goto",25,3,4.2,0.1],[676,"Kento Shiogai",25,3,4,0.2],[677,"Zion Suzuki",25,0,4.3,1.9],[678,"Keisuke Osako",25,0,4,0.3],[679,"Tomoki Hayakawa",25,0,3.8,0.1],[680,"Yuito Suzuki",25,2,5,0.9],[681,"Ao Tanaka",25,2,5,1.2],[682,"Daichi Kamada",25,2,5.8,0.3],[684,"Ritsu Doan",25,1,5.1,1],[686,"Ibrahim Sadeh",26,2,4.4,0],[687,"Mohammad Al Daoud",26,2,4.7,0],[688,"Noor Al Rawabdeh",26,2,4.7,0],[689,"Nizar Al Rashdan",26,2,4.9,0],[690,"Yazan Al Arab",26,1,3.7,0.1],[691,"Abdallah Nasib",26,1,3.6,0],[692,"Mohannad Abu Taha",26,1,3.5,0.1],[693,"Mohammad Abu Hasheesh",26,1,3.5,0],[695,"Husam Abu Al Dahab",26,1,3.5,0],[696,"Mohammad Abu Ghoush",26,1,3.5,0],[698,"Saleem Obaid",26,1,3.5,0],[699,"Mohammad Abu Al Nadi",26,1,3.5,0],[700,"Amer Jamous",26,1,3.5,0],[701,"Mousa Al Tamari",26,3,5.6,0.1],[702,"Mohammad Abu Zraiq",26,3,4.2,0],[703,"Mahmoud Al Mardi",26,3,4.2,0],[707,"Ali Azaizeh",26,3,4,0],[708,"Odeh Fakhoury",26,3,4,0],[709,"Yazeed  Abulaila",26,0,3.9,0],[710,"Abdallah Al Fakhouri",26,0,3.6,0.1],[713,"Park Jin-Seob",27,2,4.9,0],[714,"Kim Jin-Gyu",27,2,4.9,0],[715,"Kim Min-Jae",27,1,5,2.1],[716,"Seol Young-Woo",27,1,4.2,0.1],[718,"Kim Moon-Hwan",27,1,3.9,0],[719,"Lee Han-Beom",27,1,3.7,0],[720,"Lee Tae-Seok",27,1,3.7,0],[722,"Kim Tae-Hyeon",27,1,3.6,0.1],[723,"Son Heung-Min",27,3,7.4,2.1],[724,"Hwang Hee-Chan",27,3,6.1,0.1],[725,"Cho Gue-Sung",27,3,5.3,0],[726,"Oh Hyeon-Gyu",27,3,4.9,0.1],[727,"Yang Hyun-Jun",27,3,4.7,0],[728,"Eom Ji-Sung",27,3,4.6,0],[729,"Jo Hyeon-Woo",27,0,4.6,0.2],[730,"Kim Seung-Gyu",27,0,4.1,0.1],[731,"Song Bum-Keun",27,0,3.9,0.1],[732,"Paik Seung-Ho",27,2,5.6,0],[733,"Jens Castrop",27,2,5.6,0],[735,"Bae Jun-Ho",27,2,5.9,0],[736,"Lee Kang-In",27,2,6.1,0.5],[737,"Lee Jae-Sung",27,2,6.2,0.1],[738,"Obed Vargas",28,2,4.7,0.2],[740,"Johan Vásquez",28,1,4.7,2.4],[741,"César Montes",28,1,4.7,0.5],[742,"Jesús Gallardo",28,1,4.7,0.5],[743,"Jorge Sánchez",28,1,4,0.8],[744,"Israel Reyes",28,1,4,0.4],[748,"Raúl Jiménez",28,3,7,2.8],[750,"Julián Quiñones",28,3,5.6,0.4],[751,"Alexis Vega",28,3,5.3,0.1],[752,"Roberto Alvarado",28,3,5.3,0.1],[753,"Guillermo Martínez",28,3,4.7,0.2],[754,"Armando González",28,3,4.4,0.2],[755,"Guillermo Ochoa",28,0,4.2,4.9],[756,"Carlos Acevedo",28,0,4,0.3],[757,"Raúl Rangel",28,0,3.9,4.7],[758,"Brian Gutiérrez",28,2,5,1.3],[759,"Érik Lira",28,2,5.6,0.1],[762,"Orbelín Pineda",28,2,6.2,0.1],[763,"Álvaro Fidalgo",28,2,6.4,0.3],[765,"Samir El Mourabet",29,2,4.7,0],[773,"Anass Salah-Eddine",29,1,3.9,0],[777,"Ayoub El Kaabi",29,3,5.9,0.2],[782,"Gessime Yassine",29,3,4,0.2],[792,"Ismael Saibari",29,2,6.8,0.5],[795,"Denzel Dumfries",30,1,5.7,15.6],[796,"Virgil van Dijk",30,1,5.5,20],[797,"Micky van de Ven",30,1,5.1,4.7],[798,"Nathan Aké",30,1,5,2.5],[802,"Jan Paul van Hecke",30,1,4.3,1],[803,"Jorrel Hato",30,1,4.3,0.3],[804,"Cody Gakpo",30,3,7.7,3.6],[805,"Donyell Malen",30,3,6.1,1.4],[806,"Noa Lang",30,3,5.9,0.1],[807,"Brian Brobbey",30,3,5.7,0.3],[808,"Wout Weghorst",30,3,5.5,0.3],[809,"Bart Verbruggen",30,0,4.7,3.4],[810,"Mark Flekken",30,0,4.7,0.4],[812,"Ryan Gravenberch",30,2,6.1,0.9],[814,"Teun Koopmeiners",30,2,6.2,0.1],[816,"Tijjani Reijnders",30,2,6.5,1.6],[817,"Quinten Timber",30,2,6.8,0.4],[818,"Callum McCowatt",31,2,4.7,0],[820,"Alex Rufer",31,2,4.9,0],[821,"Joe Bell",31,2,5.1,0],[822,"Ryan Thomas",31,2,5.3,0],[823,"Marko Stamenic",31,2,5.6,0],[825,"Tyler Bindon",31,1,3.6,0],[826,"Francis de Vries",31,1,3.6,0],[827,"Tim Payne",31,1,3.6,0.4],[829,"Callan Elliot",31,1,3.5,0.1],[830,"Finn Surman",31,1,3.5,0],[831,"Kosta Barbarouses",31,3,4.4,0],[832,"Elijah Just",31,2,4.2,0.1],[833,"Ben Waine",31,3,4.2,0],[834,"Ben Old",31,3,4.2,0],[835,"Jesse Randall",31,3,4,0.1],[836,"Lachlan Bayliss",31,2,4,1.6],[838,"Max Crocombe",31,0,3.9,0.1],[839,"Alex Paulsen",31,0,3.8,0.1],[840,"Michael Woud",31,0,3.7,0],[841,"Sander Berge",32,2,4.7,0.3],[843,"Oscar Bobb",32,2,5.1,0.8],[844,"Morten Thorsby",32,2,5.6,0],[845,"Patrick Berg",32,2,5.6,0.1],[846,"Kristoffer Ajer",32,1,4.3,0.8],[847,"Julian Ryerson",32,1,4.2,7.7],[848,"Marcus Pedersen",32,1,4.1,0.1],[849,"Leo Østigård",32,1,4.1,0.2],[850,"David Møller Wolfe",32,1,4,0.9],[851,"Fredrik Bjørkan",32,1,4,0.3],[852,"Torbjørn Heggem",32,1,3.7,0.2],[854,"Henrik Falchener",32,1,3.5,0.3],[855,"Erling Haaland",32,3,10.5,33],[856,"Alexander Sørloth",32,3,6.8,1.4],[857,"Andreas Schjelderup",32,3,6.2,0.2],[858,"Jørgen Strand Larsen",32,3,5.6,0.2],[859,"Ørjan Nyland",32,0,4.2,2.5],[860,"Egil Selvik",32,0,3.8,0.1],[862,"Jens Petter Hauge",32,2,5.9,0.1],[863,"Antonio Nusa",32,2,6.1,3.5],[864,"Kristian Thorstvedt",32,2,6.2,0],[865,"Carlos Harvey",33,2,4.9,0],[866,"Cristian Martínez",33,2,5.3,0],[867,"Yoel Bárcenas",33,2,5.6,0],[868,"José Luis Rodríguez",33,2,5.6,0],[869,"Aníbal Godoy",33,2,5.6,0],[870,"Amir Murillo",33,1,5,1],[871,"José Córdoba",33,1,4,0.3],[872,"Éric Davis",33,1,3.9,0.1],[873,"César Blackman",33,1,3.7,0.1],[874,"Andrés Andrade",33,1,3.7,0],[875,"Roderick Miller",33,1,3.5,0.1],[876,"Jiovany Ramos",33,1,3.5,0.1],[878,"Jorge Gutiérrez",33,1,3.5,0],[879,"Ismael Díaz",33,3,4.9,0.1],[880,"José Fajardo",33,3,4.7,0],[881,"Cecilio Waterman",33,3,5,1],[882,"César Yanis",33,3,4.4,0],[884,"Luis Mejía",33,0,4,0.2],[885,"Orlando Mosquera",33,0,3.9,0.1],[886,"César Samudio",33,0,3.6,0],[887,"Adalberto Carrasquilla",33,2,6.5,0.1],[888,"Maurício Magalhães Prado",34,2,4.6,0],[889,"Alejandro Romero",34,2,4.7,0.1],[890,"Matías Galarza",34,2,4.8,0],[892,"Braian Ojeda",34,2,5.6,0],[893,"Gustavo Gómez",34,1,4.6,0.3],[894,"Júnior Alonso",34,1,4.1,0.1],[895,"Omar Alderete",34,1,4.1,0.4],[896,"Fabián Balbuena",34,1,4,0.3],[898,"Gustavo Velázquez",34,1,3.8,0],[899,"Juan José Cáceres",34,1,3.8,0.1],[900,"José Canale",34,1,3.6,0],[901,"Miguel Almirón",34,2,6,0.4],[902,"Antonio Sanabria",34,3,6.5,0.1],[903,"Ramón Sosa",34,3,5.3,0],[904,"Álex Arce",34,3,4.9,0.1],[905,"Gabriel Ávalos",34,3,4.9,0.1],[906,"Gustavo Caballero",34,3,4.2,0],[907,"Alexandro Maidana",34,3,4,0.1],[908,"Roberto Fernández",34,0,4,0.3],[909,"Gastón Olveira",34,0,3.8,0.1],[910,"Orlando Gill",34,0,3.5,0.4],[911,"Damián Bobadilla",34,2,5.5,0],[912,"Julio Enciso",34,2,6.6,0.2],[913,"Diego Gómez",34,2,6.8,0.2],[915,"Samú Costa",35,2,5.6,0],[916,"Nuno Mendes",35,1,5.8,43.2],[917,"João Cancelo",35,1,5.3,7.7],[918,"Diogo Dalot",35,1,5,2.6],[919,"Gonçalo Inácio",35,1,4.6,1.5],[921,"Renato Veiga",35,1,4.3,0.1],[922,"Tomás Araújo",35,1,4.1,0.1],[923,"Gonçalo Ramos",35,3,7.5,0.8],[924,"João Félix",35,3,6.5,2.1],[925,"Pedro Neto",35,2,6.4,0.5],[926,"Trincão",35,3,5.9,0.1],[927,"Gonçalo Guedes",35,3,5.8,0.1],[928,"Francisco Conceição",35,2,5.7,0.2],[931,"Rui Silva",35,0,4.7,0.7],[932,"José Sá",35,0,4.7,0.5],[934,"Rúben Neves",35,2,5.9,0.3],[935,"Matheus Nunes",35,2,6.1,0.2],[936,"Vitinha",35,2,6.4,11.4],[937,"João Neves",35,2,6.5,4.2],[939,"Bruno Fernandes",35,2,8.5,50.9],[942,"Mohammad Al Mannai",36,2,4.2,0.1],[943,"Ayoub Al Oui",36,2,4.4,0],[944,"Ahmed Fathy",36,2,4.7,0],[946,"Karim Boudiaf",36,2,4.9,0],[947,"Assim Madibo",36,2,5.1,0],[949,"Pedro Miguel",36,1,3.9,0],[951,"Lucas Mendes",36,1,3.8,0],[952,"Boualem Khoukhi",36,1,3.8,0],[955,"Hashmi Al Hussain",36,1,3.5,0],[957,"Issa Laye",36,1,3.5,0],[958,"Akram Afif",36,3,5.9,0.1],[959,"Almoez Ali",36,3,5.3,0],[960,"Edmílson Junior",36,3,4.9,0.1],[961,"Hassan Al Haydos",36,3,4.6,0],[962,"Yusuf Abdurisag",36,3,4.4,0],[963,"Ahmed Al Ganehi",36,3,4.2,0],[968,"Meshaal Barsham",36,0,4.1,0],[969,"Salah Zakaria",36,0,3.7,0],[971,"Mahmud Abunada",36,0,3.5,0.1],[972,"Musab Al Juwayr",37,2,4.1,0.4],[977,"Ziyad Al Johani",37,2,4.9,0],[978,"Mohamed Kanno",37,2,5.1,0],[980,"Abdullah Al Khaibari",37,2,5.1,0],[982,"Aiman Yahya",37,2,5.6,0],[983,"Saud Abdulhamid",37,1,4.1,0.2],[984,"Abdulelah Al Amri",37,1,3.7,0],[985,"Hassan Kadish",37,1,3.7,0],[986,"Ali Majrashi",37,1,3.6,0],[987,"Nawaf Bu Washl",37,1,3.5,0.1],[991,"Ali Lajami",37,1,3.5,0.1],[992,"Feras Al Brikan",37,3,5.3,0],[993,"Abdullah Al Hamddan",37,3,4.9,0.1],[994,"Khalid Al Ghannam",37,3,4.9,0.1],[995,"Saleh Al Shehri",37,3,4.9,0.1],[997,"Sultan Mandash",37,3,4.5,0],[999,"Nawaf Al Aqidi",37,0,4,0.2],[1000,"Ahmed Al Kassar",37,0,3.9,0],[1001,"Mohammed Al Owais",37,0,3.5,0.3],[1003,"John McGinn",38,2,6,2],[1007,"Ryan Christie",38,2,5.6,0.1],[1008,"Kenny McLean",38,2,4.8,0.1],[1009,"Andy Robertson",38,1,5,5],[1010,"Kieran Tierney",38,1,4.3,0.9],[1011,"Nathan Patterson",38,1,4,0.4],[1012,"Jack Hendry",38,1,3.9,0.1],[1013,"John Souttar",38,1,3.8,0.1],[1014,"Scott McKenna",38,1,3.8,0.2],[1015,"Anthony Ralston",38,1,3.8,0],[1016,"Dominic Hyam",38,1,3.6,0.1],[1018,"Grant Hanley",38,1,3.5,0.4],[1019,"Ché Adams",38,3,5.4,0.3],[1021,"George Hirst",38,3,4.6,0.1],[1022,"Lyndon Dykes",38,3,4.6,0.1],[1023,"Findlay Curtis",38,3,4,0.4],[1024,"Liam Kelly",38,0,3.7,0.3],[1025,"Angus Gunn",38,0,3.6,1.7],[1027,"Scott McTominay",38,2,6.5,10.9],[1028,"Lewis Ferguson",38,2,4.8,0.2],[1029,"Idrissa Gueye",39,2,4.9,0.3],[1030,"Pape Matar Sarr",39,2,5.6,0.5],[1031,"Pathé Ciss",39,2,5.6,0],[1032,"Pape Gueye",39,2,5.9,0.1],[1033,"Mamadou Sarr",39,1,4.7,0.3],[1034,"Moussa Niakhaté",39,1,4.3,0.1],[1035,"El Hadji Malick Diouf",39,1,4.1,0.8],[1036,"Ismail Jakobs",39,1,4.1,0],[1037,"Kalidou Koulibaly",39,1,4.9,0.7],[1038,"Abdoulaye Seck",39,1,3.8,0],[1039,"Antoine Mendy",39,1,3.7,0.2],[1041,"Nicolas Jackson",39,3,6.7,0.4],[1042,"Iliman Ndiaye",39,3,6.5,0.6],[1043,"Ismaïla Sarr",39,3,6.2,0.5],[1046,"Assane Diao",39,3,4.9,0.1],[1047,"Cherif Ndiaye",39,3,4.9,0.1],[1048,"Bamba Dieng",39,3,4.9,0.1],[1049,"Ibrahim Mbaye",39,3,4.4,0.1],[1051,"Édouard Mendy",39,0,4.5,1.1],[1052,"Yehvann Diouf",39,0,3.9,0.1],[1053,"Mory Diaw",39,0,3.8,0],[1054,"Krépin Diatta",39,2,6.1,0],[1055,"Lamine Camara",39,2,6.2,0],[1056,"Habib Diarra",39,2,6.2,0.1],[1057,"Jayden Adams",40,2,4,4],[1058,"Teboho Mokoena",40,2,4.3,0.2],[1059,"Themba Zwane",40,2,4.3,0.1],[1060,"Thalente Mbatha",40,2,4.9,0],[1061,"Tshepang Moremi",40,2,4.9,0],[1062,"Yaya Sithole",40,2,5.1,0],[1063,"Aubrey Modiba",40,1,3.7,0.1],[1064,"Thabang Matuludi",40,1,3.7,0],[1065,"Khuliso Mudau",40,1,3.6,0.1],[1066,"Nkosinathi Sibisi",40,1,3.6,0],[1067,"Mbekezeli Mbokazi",40,1,3.5,0.3],[1068,"Khulumani Ndamane",40,1,3.5,0],[1069,"Ime Okon",40,1,3.5,0],[1070,"Samukele Kabini",40,1,3.5,0],[1071,"Lyle Foster",40,3,5.4,0.1],[1072,"Relebohile Mofokeng",40,3,4.9,0.1],[1073,"Oswin Appollis",40,3,4.9,0.1],[1075,"Evidence Makgopa",40,3,4.5,0],[1076,"Thapelo Maseko",40,3,4.2,0],[1077,"Ronwen Williams",40,0,4.5,0.4],[1078,"Ricardo Goss",40,0,3.7,0],[1081,"Yéremy Pino",41,2,5.9,0.1],[1082,"Álex Baena",41,2,6,0.2],[1084,"Martín Zubimendi",41,2,6.1,0.4],[1085,"Pedro Porro",41,1,5.5,7.2],[1086,"Aymeric Laporte",41,1,5.5,4.9],[1087,"Alejandro Grimaldo",41,1,4.9,1.6],[1088,"Marc Cucurella",41,1,5.1,24.4],[1089,"Pau Cubarsí",41,1,5,5.5],[1092,"Lamine Yamal",41,2,10,42.8],[1093,"Ferran Torres",41,3,7.8,3.7],[1094,"Mikel Oyarzabal",41,3,8.1,18.5],[1095,"Borja Iglesias",41,3,6.8,0.1],[1097,"Víctor Muñoz",41,3,4,0.7],[1098,"David Raya",41,0,5,14.9],[1099,"Unai Simón",41,0,5,6],[1101,"Joan García",41,0,4,1.2],[1102,"Marcos Llorente",41,1,5.5,5],[1104,"Rodri",41,2,7.5,1.8],[1105,"Dani Olmo",41,2,7.7,3.1],[1106,"Pedri",41,2,8.1,9.9],[1109,"Besfort Zeneli",42,2,4.7,0],[1110,"Elliot Stroud",42,2,4.7,0],[1111,"Taha Ali",42,2,4.9,0.1],[1112,"Eric Smith",42,2,4.9,0],[1113,"Lucas Bergvall",42,2,5.1,0.4],[1114,"Yasin Ayari",42,2,5.3,0.2],[1116,"Jesper Karlström",42,2,5.6,0],[1117,"Mattias Svanberg",42,2,6.1,0],[1118,"Daniel Svensson",42,1,4.5,0.5],[1119,"Gabriel Gudmundsson",42,1,4.2,0.6],[1120,"Carl Starfelt",42,1,4.1,0.1],[1121,"Victor Lindelöf",42,1,4,1.7],[1122,"Gustaf Lagerbielke",42,1,3.7,0.2],[1124,"Viktor Gyökeres",42,3,7.8,5.9],[1125,"Anthony Elanga",42,3,5.8,0.4],[1126,"Benjamin Nygren",42,3,4.9,0.1],[1127,"Gustaf Nilsson",42,3,4.9,0.1],[1129,"Kristoffer Nordfeldt",42,0,3.9,0.4],[1133,"Johan Manzambi",43,2,5.6,0.2],[1135,"Granit Xhaka",43,2,6.2,4.7],[1137,"Michel Aebischer",43,2,5.9,0],[1138,"Remo Freuler",43,2,5.9,0],[1139,"Ardon Jashari",43,2,5.2,0],[1140,"Fabian Rieder",43,2,6.2,0],[1141,"Manuel Akanji",43,1,5,4.9],[1142,"Ricardo Rodríguez",43,1,4.5,1.7],[1143,"Nico Elvedi",43,1,4.3,3],[1144,"Silvan Widmer",43,1,4.2,1.6],[1145,"Miro Muheim",43,1,4,0.3],[1146,"Eray Cömert",43,1,3.9,0],[1147,"Aurèle Amenda",43,1,3.7,0],[1148,"Luca Jaquez",43,1,3.5,0.1],[1149,"Breel Embolo",43,3,7.5,2.6],[1150,"Noah Okafor",43,3,5.9,0.4],[1151,"Dan Ndoye",43,3,6.8,0.8],[1153,"Gregor Kobel",43,0,4.7,6.4],[1154,"Yvon Mvogo",43,0,4.2,0.1],[1155,"Marvin Keller",43,0,3.7,0.2],[1156,"Djibril Sow",43,2,6.1,0],[1157,"Denis Zakaria",43,2,6.1,0.1],[1158,"Rubén Vargas",43,2,6.8,0.5],[1160,"Ellyes Skhiri",44,2,4.7,0],[1161,"Rani Khedira",44,2,4.7,0],[1162,"Hadj Mahmoud",44,2,4.9,0],[1163,"Mortadha Ben Ouanes",44,2,5,0.7],[1164,"Anis Ben Slimane",44,2,5.3,0],[1165,"Moutaz Neffati",44,1,4.1,0],[1166,"Ali Abdi",44,1,4.1,0.1],[1167,"Omar Rekik",44,1,3.8,0],[1169,"Adem Arous",44,1,3.6,0],[1170,"Mohamed Amine Ben Hmida",44,1,3.6,0],[1172,"Raed Chikhaoui",44,1,3.5,0],[1174,"Ismaël Gharbi",44,3,4.6,0],[1175,"Elias Saad",44,3,4.5,0],[1176,"Firas Chaouat",44,3,4.4,0],[1177,"Sebastian Tounekti",44,3,4.4,0],[1178,"Hazem Mastouri",44,3,4.2,0.1],[1181,"Rayan Elloumi",44,3,4,0.1],[1183,"Khalil Ayari",44,3,4,0.3],[1184,"Abdelmouhib Chamakh",44,0,4.1,0.1],[1185,"Aymen Dahmen",44,0,3.9,0],[1187,"Sabri Ben Hessen",44,0,3.5,0.1],[1188,"Ismail Yüksek",45,2,4.6,0.1],[1189,"Salih Özcan",45,2,4.7,0.1],[1191,"Irfan Can Kahveci",45,2,5.9,0],[1192,"Orkun Kökçü",45,2,6,0.3],[1193,"Kaan Ayhan",45,1,4.5,0.1],[1194,"Zeki Çelik",45,1,4.3,0.1],[1195,"Ferdi Kadioglu",45,1,4.3,1.6],[1196,"Samet Akaydin",45,1,4.1,0],[1197,"Mert Müldür",45,1,4.1,0],[1198,"Ozan Kabak",45,1,4,0.3],[1199,"Eren Elmali",45,1,4,0.3],[1200,"Abdülkerim Bardakci",45,1,4,0.4],[1201,"Merih Demiral",45,1,4,0.7],[1204,"Kenan Yildiz",45,2,7,3.6],[1205,"Kerem Aktürkoglu",45,3,6.2,0.3],[1206,"Baris Alper Yilmaz",45,3,6.1,0.6],[1208,"Oguz Aydin",45,3,5,1],[1209,"Yunus Akgün",45,3,4.9,0.1],[1210,"Deniz Gül",45,3,4.4,0.1],[1211,"Ugurcan Çakir",45,0,4.2,1.3],[1212,"Altay Bayindir",45,0,4,0.7],[1213,"Mert Günok",45,0,4,0.2],[1215,"Arda Güler",45,2,7,9.2],[1216,"Hakan Çalhanoglu",45,2,7.1,2.4],[1218,"Juan Manuel Sanabria",46,2,4.5,0.1],[1219,"Emiliano Martínez",46,2,4.7,0.1],[1222,"Facundo Pellistri",46,2,5.2,0.1],[1223,"Maxi Araújo",46,2,6.4,0.3],[1224,"Manuel Ugarte",46,2,5.9,0.2],[1225,"Nicolás de la Cruz",46,2,5.9,0.1],[1226,"Ronald Araujo",46,1,5,3.1],[1227,"José María Giménez",46,1,4.4,1.6],[1228,"Matías Viña",46,1,4.3,0.1],[1229,"Mathías Olivera",46,1,4.3,1.2],[1230,"Guillermo Varela",46,1,4.2,0.4],[1231,"Sebastián Cáceres",46,1,4.2,0.1],[1232,"Santiago Bueno",46,1,4.1,0.1],[1236,"Darwin Núñez",46,3,7.5,1.6],[1237,"Federico Viñas",46,3,5.9,0],[1238,"Brian Rodríguez",46,3,6.2,0.1],[1239,"Rodrigo Aguirre",46,3,5.6,0],[1241,"Agustín Canobbio",46,3,5.3,0],[1244,"Sergio Rochet",46,0,4.1,4.3],[1245,"Fernando Muslera",46,0,4.1,0.5],[1246,"Santiago Mele",46,0,3.5,0.2],[1247,"Giorgian de Arrascaeta",46,2,6.5,0.3],[1248,"Federico Valverde",46,2,7.5,5.9],[1249,"Cristian Roldan",47,2,4.7,0.1],[1250,"Sebastian Berhalter",47,2,4.7,0.1],[1253,"Brenden Aaronson",47,2,5.7,0.3],[1254,"Malik Tillman",47,2,6.1,0.2],[1255,"Weston McKennie",47,2,6.1,0.5],[1256,"Giovanni Reyna",47,2,5.5,0.2],[1258,"Antonee Robinson",47,1,5,3.4],[1259,"Chris Richards",47,1,4.1,0.6],[1260,"Joe Scally",47,1,4.1,0],[1261,"Tim Ream",47,1,3.9,0.2],[1262,"Mark McKenzie",47,1,3.9,0.2],[1263,"Auston Trusty",47,1,3.9,0.1],[1264,"Alexander Freeman",47,1,4,0.4],[1265,"Timothy Weah",47,2,5.8,0.3],[1266,"Ricardo Pepi",47,3,5.9,0.1],[1267,"Folarin Balogun",47,3,6,0.9],[1269,"Max Arfsten",47,3,4.4,0],[1270,"Matt Turner",47,0,4,0.9],[1271,"Matt Freese",47,0,4.2,0.5],[1273,"Chris Brady",47,0,3.5,0.8],[1274,"Christian Pulisic",47,2,7,5.1],[1275,"Abdulla Abdullaev",48,2,4.2,0.1],[1278,"Sherzod Esanov",48,2,4.7,0],[1282,"Akmal Mozgovoy",48,2,4.7,0],[1284,"Otabek Shukurov",48,2,5,0.8],[1286,"Dostonbek Khamdamov",48,2,5.1,0],[1287,"Aziz G'aniev",48,2,5.3,0],[1288,"Odiljon Hamrobekov",48,2,5.3,0],[1289,"Oston Urunov",48,2,5.6,0],[1290,"Jamshid Iskanderov",48,2,5.7,0],[1291,"Jaloliddin Masharipov",48,2,6.1,0],[1292,"Abbosbek Fayzullaev",48,2,6.2,0],[1293,"Abdukodir Khusanov",48,1,4.3,0.9],[1294,"Rustam Ashurmatov",48,1,3.7,0],[1295,"Sherzod Nasrullaev",48,1,3.7,0],[1296,"Farrukh Sayfiev",48,1,3.6,0],[1297,"Khojiakbar Alijonov",48,1,3.6,0],[1300,"Umar Eshmurodov",48,1,3.5,0.1],[1302,"Avazbek O'lmasaliev",48,1,3.5,0],[1303,"Bekhruz Karimov",48,1,3.5,0],[1305,"Jakhongir Urozov",48,1,3.5,0],[1306,"Eldor Shomurodov",48,3,6.5,0.1],[1307,"Igor Sergeev",48,3,6.1,0],[1310,"Azizbek Amanov",48,3,4.9,0.1],[1311,"Abduvokhid Ne'matov",48,0,4,0.2],[1312,"Utkir Yusupov",48,0,3.9,0],[1314,"Botirali Ergashev",48,0,3.5,0.2],[1318,"Lisandro Martínez",2,1,4.6,2.6],[1320,"Facundo Medina",2,1,4,0.5],[1323,"Gonzalo Montiel",2,1,4.3,0.3],[1326,"Giovani Lo Celso",2,2,6.2,0.1],[1338,"Lautaro Martínez",2,3,8.8,4.1],[1341,"Dennis Hadzikadunic",6,1,3.7,0],[1342,"Ermin Mahmic",6,2,4.2,0.1],[1343,"Weverton",7,0,4.5,0.1],[1345,"Alex Sandro",7,1,4.5,0.7],[1361,"Bruno Guimarães",7,2,6.8,2],[1366,"Raphinha",7,2,8.2,21.6],[1369,"Neymar",7,2,7.2,3.1],[1374,"Yerry Mina",10,1,4.2,0.3],[1379,"Willer Ditta",10,1,3.7,0.1],[1385,"Juan Portilla",10,2,4.7,0],[1396,"Cucho Hernández",10,3,6.3,0.3],[1400,"Jindrich Stanek",15,0,4,0.2],[1405,"David Zima",15,1,3.9,0],[1411,"Alexandr Sojka",15,2,4.5,0],[1413,"David Doudera",15,2,5.1,0],[1417,"Hugo Sochurek",15,2,4.3,0.1],[1425,"Jan Kuchta",15,3,5.5,0],[1427,"Adam Hlozek",15,3,6.5,0.1],[1428,"Robin Risser",19,0,3.5,0.3],[1429,"William Saliba",19,1,5.3,15.3],[1430,"Jules Koundé",19,1,5.4,7.2],[1431,"Bradley Barcola",19,2,8,1.4],[1432,"Jean-Philippe Mateta",19,3,6.5,0.3],[1445,"Augustine Boakye",21,2,4.9,0],[1454,"Ko Itakura",25,1,4.5,0.2],[1455,"Takehiro Tomiyasu",25,1,4.9,0.6],[1456,"Yuto Nagatomo",25,1,3.7,0.1],[1457,"Wataru Endo",25,2,6,0.4],[1458,"Takefusa Kubo",25,2,7,1],[1465,"Mateo Chávez",28,1,3.5,0.8],[1473,"César Huerta",28,2,6.3,0.1],[1474,"Edson Álvarez",28,2,6,0.5],[1476,"Gilberto Mora",28,2,4.5,0.8],[1477,"Luis Chávez",28,2,6.3,0.2],[1478,"Luis Romo",28,2,5.5,0],[1485,"Santiago Giménez",28,3,6.8,0.6],[1488,"Michael Boxall",31,1,3.7,0],[1489,"Liberato Cacace",31,1,4.1,0],[1490,"Nando Pijnaker",31,1,3.7,0],[1491,"Tommy Smith",31,1,3.6,0],[1492,"Matthew Garbett",31,3,5,0.9],[1493,"Chris Wood",31,3,6.5,0.6],[1494,"Sarpreet Singh",31,2,5.3,0],[1506,"Homam El Amin",36,1,3.6,0],[1507,"Sultan Al Brake",36,1,3.7,0],[1508,"Abdulaziz Hatem",36,2,5.3,0],[1509,"Jassem Gaber",36,2,5,0.7],[1510,"Ahmed Alaa",36,3,5.5,0],[1511,"Mohammed Muntari",36,3,5.3,0],[1513,"Tahsin Jamshid",36,3,4.5,0],[1514,"Viktor Johansson",42,0,3.9,0.2],[1515,"Jacob Widell Zetterström",42,0,3.7,0.1],[1516,"Hjalmar Ekdal",42,1,3.7,0.1],[1518,"Isak Hien",42,1,4.1,0.1],[1519,"Ken Sema",42,2,6,0.1],[1520,"Alexander Isak",42,3,8,3.3],[1521,"Alexander Bernhardsson",42,3,4.9,0.1],[1522,"Thibaut Courtois",5,0,4.9,12.8],[1523,"Mike Penders",5,0,3.5,0.7],[1524,"Hans Vanaken",5,2,5.5,0.1],[1525,"Matias Fernandez-Pardo",5,3,5.6,0.1],[1526,"Leandro Trossard",5,2,6.6,2.4],[1527,"Diego Moreira",5,2,4.7,0.1],[1528,"Stopira",8,1,3.5,0.1],[1529,"Logan Costa",8,1,3.5,0.1],[1530,"Jamiro Monteiro",8,2,4.6,0],[1531,"Hélio Varela",8,2,4.9,0],[1532,"Gilson Benchimol",8,2,5,0.7],[1533,"Oumar Diakité",12,3,5.3,0],[1534,"Ange-Yoan Bonny",12,3,4.9,0.1],[1535,"Dominik Kotarski",13,0,4.4,0.1],[1536,"Josko Gvardiol",13,1,5,5],[1537,"Mateo Kovacic",13,2,6,0.4],[1538,"Keeto Thermoncy",22,1,3.5,0.1],[1539,"Dominique Simon",22,2,4.3,0.1],[1540,"Lenny Joseph",22,3,4.2,0],[1541,"Nour Bani Ateyah",26,0,3.6,0],[1543,"Ehsan Haddad",26,1,3.5,0.1],[1544,"Saed Al Rosan",26,1,3.5,0.1],[1545,"Anas Badawi",26,1,3.5,0.1],[1546,"Raja'ei Ayed",26,2,4.5,0],[1547,"Ali Olwan",26,3,4.2,0.1],[1548,"Lee Gi-Hyuk",27,1,4.5,0.1],[1549,"Hwang In-Beom",27,2,5.8,0],[1550,"Lee Dong-Gyeong",27,2,4.9,0],[1551,"Montassar Talbi",44,1,3.9,0.1],[1552,"Dylan Bronn",44,1,3.6,0],[1553,"Yan Valery",44,1,3.9,0],[1554,"Elias Achouri",44,2,4.8,0],[1555,"Hannibal Mejbri",44,2,4.8,0.2],[1556,"Gédéon Kalulu",11,1,3.9,0],[1557,"Gaël Kakuta",11,2,4.6,0],[1558,"Armando Obispo",14,1,3.7,0],[1559,"Deveron Fonville",14,1,3.7,0],[1560,"Jürgen Locadia",14,3,4.1,0.1],[1561,"Roozbeh Cheshmi",23,2,4.8,0],[1563,"Jalal Hassan",24,0,3.9,0],[1564,"Mustafa Saadoon",24,1,3.6,0],[1568,"Ahmed Qasem",24,2,4.4,0],[1569,"Diogo Costa",35,0,4.9,9.9],[1570,"Rúben Dias",35,1,5,5.7],[1571,"Nélson Semedo",35,1,4.3,0.2],[1572,"Bernardo Silva",35,2,7.8,2.4],[1573,"Cristiano Ronaldo",35,3,10,11.7],[1574,"Rafael Leão",35,2,7.8,2],[1576,"Craig Gordon",38,0,3.5,2.9],[1577,"Aaron Hickey",38,1,4.3,0.2],[1578,"Ben Gannon-Doak",38,2,4.9,0.3],[1579,"Ross Stewart",38,3,5.4,0],[1580,"Lawrence Shankland",38,3,5.5,0.8],[1581,"Christian Fassnacht",43,2,6.1,0],[1582,"Zeki Amdouni",43,3,4.9,0.1],[1583,"Cedric Itten",43,3,5.4,0],[1586,"Çaglar Söyüncü",45,1,4.4,0.2],[1589,"Can Uzun",45,2,5.3,0.1],[1591,"Aaron Tshibola",11,2,4.9,0],[1592,"Karim Hafez",17,1,3.9,0],[1593,"Nabil Emad Dunga",17,2,4.3,0],[1594,"Mostafa Zico",17,2,4.2,0.2],[1596,"Hamza Abdelkarim",17,3,4.3,0.1],[1597,"Mohamed Salah",17,2,10,5],[1598,"Manuel Neuer",20,0,5,12.5],[1599,"Nadiem Amiri",20,2,6.3,0.1],[1600,"Jamal Musiala",20,2,8,12.4],[1601,"Felix Nmecha",20,2,5.6,0.1],[1602,"Aleksandar Pavlovic",20,2,5.5,0.6],[1603,"Jamie Leweling",20,2,6.4,0.1],[1604,"Maximilian Beier",20,3,6.5,0.1],[1616,"Andrés Cubas",34,2,4.7,0],[1665,"Munir El Kajoui",29,0,4,0.2],[1668,"Youssef Belammari",29,1,3.6,0.1],[1674,"Ayyoub Bouaddi",29,2,5.5,0.1],[1676,"Ayoube Amaimouni-Echghouyab",29,3,4.3,0],[1681,"Sander Tangvik",32,0,3.5,0.9],[1682,"Thelo Aasgaard",32,2,5.5,0.1],[1683,"Fredrik Aursnes",32,2,6.5,0.2],[1684,"Martin Ødegaard",32,2,7.7,4.6],[1688,"Isidro Pitta",34,3,5.9,0],[1695,"Bara Sapoko Ndiaye",39,2,4.5,0.1],[1696,"Sadio Mané",39,2,7.6,1.9],[1698,"Sipho Chaine",40,0,3.7,0],[1700,"Olwethu Makhanya",40,1,3.5,0.3],[1701,"Bradley Cross",40,1,3.6,0],[1704,"Kamogelo Sebelebele",40,2,4.5,0],[1707,"Iqraam Rayners",40,2,5.3,0],[1708,"Jarell Quansah",18,1,4.4,0.1],[1709,"Reece James",18,1,5.2,4.3],[1710,"Eberechi Eze",18,2,8,1.4],[1711,"Ollie Watkins",18,3,7.9,1.4],[1712,"Ivan Toney",18,3,7.5,0.2],[1714,"Sondre Langås",32,1,4,0.3],[1947,"Nilson Angulo",16,2,6,0.2],[1951,"Hassan Al Tambakti",37,1,4.5,0.1],[1953,"Jehad Thikri",37,1,4,0.3],[1954,"Moteb Al Harbi",37,1,4.1,0],[1955,"Salem Al Dawsari",37,2,7.2,0.2],[1956,"Alaa Al Hejji",37,2,5,0.7],[1957,"Nasser Al Dawsari",37,2,5.2,0.1],[1958,"Mohammed Abu Al Shamat",37,2,5.5,0],[1961,"Alphonso Davies",9,1,4.9,4.3],[1963,"Alistair Johnston",9,1,4,0.5],[1964,"Moïse Bombito",9,1,4.1,0.1],[1966,"Alfie Jones",9,1,3.8,0],[1967,"Stephen Eustaquio",9,2,5,0.9],[1968,"Jacob Shaffelburg",9,2,5.2,0],[1970,"Promise David",9,3,5.4,0.1],[1971,"Lawrence Ati Zigi",21,0,4,0.3],[1972,"Joseph Anang",21,0,3.6,0.1],[1973,"Abdul Baba",21,1,3.9,0.1],[1974,"Alidu Seidu",21,1,3.9,0],[1975,"Kojo Peprah Oppong",21,1,3.5,0.3],[1976,"Jonas Adjetey",21,1,3.5,0.3],[1977,"Abdul Mumin",21,1,3.7,0],[1979,"Marvin Senaya",21,1,3.5,1.2],[1980,"Jerome Opoku",21,1,3.8,0],[1981,"Gideon Mensah",21,1,3.9,0.1],[1982,"Caleb Yirenkyi",21,2,4.7,0],[1983,"Thomas Partey",21,2,6.2,0.1],[1984,"Elisha Owusu",21,2,5.3,0],[1985,"Kwasi Sibo",21,2,4.7,0],[1986,"Jordan Ayew",21,3,5.3,0.1],[1987,"Iñaki Williams",21,3,5.9,0.4],[1988,"Ernest Nuamah",21,2,5,0.8],[1989,"Prince Adu",21,3,4,1.2],[1990,"Abdul Fatawu",21,3,6.4,0.1],[1991,"Christopher Bonsu Baah",21,3,4.5,0],[1992,"Antoine Semenyo",21,3,7.2,4.5],[1993,"Brandon Thomas-Asante",21,3,5.1,0],[1994,"Kamaldeen Sulemana",21,3,5.1,0],[1995,"Eric García",41,1,4.5,1],[1996,"Marc Pubill",41,1,4.2,0.2],[1997,"Mikel Merino",41,2,6.2,0.6],[1998,"Fabián Ruiz",41,2,6.8,1.1],[1999,"Gavi",41,2,6.5,0.9],[2000,"Nico Williams",41,2,7.8,3.7],[2002,"Harry Souttar",3,1,4.1,0.2],[2003,"Cameron Devlin",3,2,4.7,0],[2004,"Jackson Irvine",3,2,5.6,0.1],[2005,"Mathew Leckie",3,2,4.7,0],[2006,"Mohamed Touré",3,3,5,1.1],[2007,"Tete Yengi",3,3,4.3,0],[2009,"Ahmed Tagnaouti",29,0,3.5,1.3],[2010,"Yassine Bounou",29,0,4.7,3.2],[2011,"Nayef Aguerd",29,1,4.3,0.2],[2012,"Achraf Hakimi",29,1,6,21.9],[2013,"Chadi Riad",29,1,3.9,0.1],[2014,"Noussair Mazraoui",29,1,4.4,1],[2015,"Redouane Halhal",29,1,3.5,2.8],[2016,"Issa Diop",29,1,4.5,0.2],[2017,"Zakaria El Ouahdi",29,1,4.1,0],[2018,"Sofyan Amrabat",29,2,5.9,0.1],[2019,"Neil El Aynaoui",29,2,5.6,0.1],[2020,"Brahim Díaz",29,2,6.4,1.9],[2021,"Azzedine Ounahi",29,2,6.2,0.1],[2022,"Bilal El Khannouss",29,2,6.2,0.1],[2023,"Soufiane Rahimi",29,3,5.6,0.1],[2024,"Abde Ezzalzouli",29,3,5.3,0.2],[2025,"Chemsdine Talbi",29,3,4.4,0.1],[2026,"Fidel Escobar",33,1,3.8,0.1],[2027,"Edgardo Fariña",33,1,3.9,0],[2028,"Alberto Quintero",33,3,4.2,0],[2029,"Azarías Londoño",33,3,4.4,0],[2030,"Tomás Rodríguez",33,3,4.5,0],[2031,"Sergiño Dest",47,1,4.3,1.9],[2032,"Miles Robinson",47,1,4,0.4],[2033,"Tyler Adams",47,2,5.3,0.3],[2034,"Haji Wright",47,3,5.3,0.1],[2035,"Álex Zendejas",47,2,5.5,0],[2036,"Robin Roefs",30,0,4.6,0.4],[2038,"Guus Til",30,2,4.9,0.1],[2039,"Mats Wieffer",30,2,4.8,0.1],[2040,"Frenkie de Jong",30,2,7,1.7],[2041,"Marten de Roon",30,2,5.1,0.1],[2042,"Justin Kluivert",30,2,6.5,0.2],[2043,"Memphis Depay",30,3,7.4,1.2],[2044,"Crysencio Summerville",30,2,5.3,0.5],[2046,"Oussama Benbot",1,0,4.2,0],[2047,"Samir Chergui",1,1,4,0.2],[2048,"Mohamed Tougaï",1,1,4,0.2],[2049,"Nabil Bentaleb",1,2,5.5,0],[2050,"Cristian Volpato",3,2,6,0.1],[2051,"Christopher Opéri",12,1,4,0.2],[2052,"Piero Hincapié",16,1,4.7,3.7],[2053,"Willian Pacho",16,1,4.4,5.3],[2060,"Tyler Fletcher",38,2,4.7,0.1],[2062,"Herman Johansson",42,2,4.4,0.2],[2063,"Joaquín Piquerez",46,1,4.5,0.1],[2064,"Rodrigo Bentancur",46,2,6,0.2],[2065,"Rodrigo Zalazar",46,2,6,0.1],[2066,"Jaouen Hadjam",1,1,3.8,0],[2067,"Mladen Jurkas",6,0,3.5,2.9],[2068,"Derrick Luckassen",21,1,3.7,0],[2069,"Shahriyar Moghanlou",23,3,4.7,0],[2070,"Cho Wi-Je",27,1,3.7,0],[2072,"Assan Ouédraogo",20,2,4.5,0.1],[2073,"Éderson",7,2,6.3,0],[2074,"Lutsharel Geertruida",30,1,4.3,0]],"s":[[1,"Algeria","j","ALG"],[2,"Argentina","j","ARG"],[3,"Australia","d","AUS"],[4,"Austria","j","AUT"],[5,"Belgium","g","BEL"],[6,"Bosnia and Herzegovina","b","BIH"],[7,"Brazil","c","BRA"],[8,"Cabo Verde","h","CPV"],[9,"Canada","b","CAN"],[10,"Colombia","k","COL"],[11,"Congo DR","k","COD"],[12,"Côte d'Ivoire","e","CIV"],[13,"Croatia","l","CRO"],[14,"Curaçao","e","CUW"],[15,"Czechia","a","CZE"],[16,"Ecuador","e","ECU"],[17,"Egypt","g","EGY"],[18,"England","l","ENG"],[19,"France","i","FRA"],[20,"Germany","e","GER"],[21,"Ghana","l","GHA"],[22,"Haiti","c","HAI"],[23,"IR Iran","g","IRN"],[24,"Iraq","i","IRQ"],[25,"Japan","f","JPN"],[26,"Jordan","j","JOR"],[27,"Korea Republic","a","KOR"],[28,"Mexico","a","MEX"],[29,"Morocco","c","MAR"],[30,"Netherlands","f","NED"],[31,"New Zealand","g","NZL"],[32,"Norway","i","NOR"],[33,"Panama","l","PAN"],[34,"Paraguay","d","PAR"],[35,"Portugal","k","POR"],[36,"Qatar","b","QAT"],[37,"Saudi Arabia","h","KSA"],[38,"Scotland","c","SCO"],[39,"Senegal","i","SEN"],[40,"South Africa","a","RSA"],[41,"Spain","h","ESP"],[42,"Sweden","f","SWE"],[43,"Switzerland","b","SUI"],[44,"Tunisia","f","TUN"],[45,"Türkiye","d","TUR"],[46,"Uruguay","h","URU"],[47,"USA","d","USA"],[48,"Uzbekistan","k","UZB"]],"f":[[1,"2026-06-11T20:00","Mexico City",28,40],[1,"2026-06-12T03:00","Guadalajara",27,15],[1,"2026-06-12T20:00","Toronto",9,6],[1,"2026-06-13T02:00","Inglewood, California",47,34],[1,"2026-06-13T20:00","Santa Clara, California",36,43],[1,"2026-06-13T23:00","East Rutherford, New Jersey",7,29],[1,"2026-06-14T02:00","Foxborough, Massachusetts",22,38],[1,"2026-06-14T05:00","Vancouver",3,45],[1,"2026-06-14T18:00","Houston, Texas",20,14],[1,"2026-06-14T21:00","Arlington, Texas",30,25],[1,"2026-06-15T00:00","Philadelphia, Pennsylvania",12,16],[1,"2026-06-15T03:00","Guadalupe",42,44],[1,"2026-06-15T17:00","Atlanta, Georgia",41,8],[1,"2026-06-15T20:00","Seattle, Washington",5,17],[1,"2026-06-15T23:00","Miami Gardens, Florida",37,46],[1,"2026-06-16T02:00","Inglewood, California",23,31],[1,"2026-06-16T20:00","East Rutherford, New Jersey",19,39],[1,"2026-06-16T23:00","Foxborough, Massachusetts",24,32],[1,"2026-06-17T02:00","Kansas City, Missouri",2,1],[1,"2026-06-17T05:00","Santa Clara, California",4,26],[1,"2026-06-17T18:00","Houston, Texas",35,11],[1,"2026-06-17T21:00","Arlington, Texas",18,13],[1,"2026-06-18T00:00","Toronto",21,33],[1,"2026-06-18T03:00","Mexico City",48,10],[2,"2026-06-18T17:00","Atlanta, Georgia",15,40],[2,"2026-06-18T20:00","Inglewood, California",43,6],[2,"2026-06-18T23:00","Vancouver",9,36],[2,"2026-06-19T02:00","Guadalajara",28,27],[2,"2026-06-19T20:00","Seattle, Washington",47,3],[2,"2026-06-19T23:00","Foxborough, Massachusetts",38,29],[2,"2026-06-20T01:30","Philadelphia, Pennsylvania",7,22],[2,"2026-06-20T04:00","Santa Clara, California",45,34],[2,"2026-06-20T18:00","Houston, Texas",30,42],[2,"2026-06-20T21:00","Toronto",20,12],[2,"2026-06-21T01:00","Kansas City, Missouri",16,14],[2,"2026-06-21T05:00","Guadalupe",44,25],[2,"2026-06-21T17:00","Atlanta, Georgia",41,37],[2,"2026-06-21T20:00","Inglewood, California",5,23],[2,"2026-06-21T23:00","Miami Gardens, Florida",46,8],[2,"2026-06-22T02:00","Vancouver",31,17],[2,"2026-06-22T18:00","Arlington, Texas",2,4],[2,"2026-06-22T22:00","Philadelphia, Pennsylvania",19,24],[2,"2026-06-23T01:00","East Rutherford, New Jersey",32,39],[2,"2026-06-23T04:00","Santa Clara, California",26,1],[2,"2026-06-23T18:00","Houston, Texas",35,48],[2,"2026-06-23T21:00","Foxborough, Massachusetts",18,21],[2,"2026-06-24T00:00","Toronto",33,13],[2,"2026-06-24T03:00","Guadalajara",10,11],[3,"2026-06-24T20:00","Vancouver",43,9],[3,"2026-06-24T20:00","Seattle, Washington",6,36],[3,"2026-06-24T23:00","Atlanta, Georgia",29,22],[3,"2026-06-24T23:00","Miami Gardens, Florida",38,7],[3,"2026-06-25T02:00","Guadalupe",40,27],[3,"2026-06-25T02:00","Mexico City",15,28],[3,"2026-06-25T21:00","East Rutherford, New Jersey",16,20],[3,"2026-06-25T21:00","Philadelphia, Pennsylvania",14,12],[3,"2026-06-26T00:00","Kansas City, Missouri",44,30],[3,"2026-06-26T00:00","Arlington, Texas",25,42],[3,"2026-06-26T03:00","Inglewood, California",45,47],[3,"2026-06-26T03:00","Santa Clara, California",34,3],[3,"2026-06-26T20:00","Foxborough, Massachusetts",32,19],[3,"2026-06-26T20:00","Toronto",39,24],[3,"2026-06-27T01:00","Guadalajara",46,41],[3,"2026-06-27T01:00","Houston, Texas",8,37],[3,"2026-06-27T04:00","Vancouver",31,5],[3,"2026-06-27T04:00","Seattle, Washington",17,23],[3,"2026-06-27T22:00","Philadelphia, Pennsylvania",13,21],[3,"2026-06-27T22:00","East Rutherford, New Jersey",33,18],[3,"2026-06-28T00:30","Atlanta, Georgia",11,48],[3,"2026-06-28T00:30","Miami Gardens, Florida",10,35],[3,"2026-06-28T03:00","Arlington, Texas",26,2],[3,"2026-06-28T03:00","Kansas City, Missouri",1,4]]};
const POSN = ["GK","DEF","MID","FWD"];
function expandSnap() {
  const players = SNAP.p.map(a=>({id:a[0], knownName:a[1], firstName:null, lastName:a[1], squadId:a[2], position:POSN[a[3]], price:a[4], percentSelected:a[5], status:"playing"}));
  const squads = SNAP.s.map(a=>({id:a[0], name:a[1], group:a[2], abbr:a[3]}));
  const byRound = {};
  SNAP.f.forEach(a=>{ (byRound[a[0]]=byRound[a[0]]||[]).push({date:a[1], venueCity:a[2], homeSquadId:a[3], awaySquadId:a[4], homeScore:null, awayScore:null, status:"scheduled"}); });
  const rounds = Object.keys(byRound).map(Number).sort((x,y)=>x-y).map(id=>({id, tournaments:byRound[id]}));
  return {players, squads, rounds};
}

const FLAGS = {ALG:"🇩🇿",ARG:"🇦🇷",AUS:"🇦🇺",AUT:"🇦🇹",BEL:"🇧🇪",BIH:"🇧🇦",BRA:"🇧🇷",CPV:"🇨🇻",CAN:"🇨🇦",COL:"🇨🇴",COD:"🇨🇩",CIV:"🇨🇮",CRO:"🇭🇷",CUW:"🇨🇼",CZE:"🇨🇿",ECU:"🇪🇨",EGY:"🇪🇬",ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",FRA:"🇫🇷",GER:"🇩🇪",GHA:"🇬🇭",HAI:"🇭🇹",IRN:"🇮🇷",IRQ:"🇮🇶",JPN:"🇯🇵",JOR:"🇯🇴",KOR:"🇰🇷",MEX:"🇲🇽",MAR:"🇲🇦",NED:"🇳🇱",NZL:"🇳🇿",NOR:"🇳🇴",PAN:"🇵🇦",PAR:"🇵🇾",POR:"🇵🇹",QAT:"🇶🇦",KSA:"🇸🇦",SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",SEN:"🇸🇳",RSA:"🇿🇦",ESP:"🇪🇸",SWE:"🇸🇪",SUI:"🇨🇭",TUN:"🇹🇳",TUR:"🇹🇷",USA:"🇺🇸",URU:"🇺🇾",UZB:"🇺🇿"};
const PROG_LABEL = {TITLE:"Title contender",SF:"Semi-final calibre",QF:"Quarter-final calibre",R16:"Round of 16 calibre",R32:"Knockout hopeful"};
const PROG_MULT = {TITLE:2.05,SF:1.8,QF:1.55,R16:1.32,R32:1.12};
const POS_ORDER = {GK:0,DEF:1,MID:2,FWD:3};
const QUOTA = {GK:2,DEF:5,MID:5,FWD:3};
const BUDGET = 100.001;   // $100m squad cap (0.001 tolerance for float sums)
const NATION_MAX = 3;     // max players per nation through the group stage and R32

const NOTABLE_ABSENCES = "Not in final squads (injury or selection): Foden, Palmer (England) · Rodrygo, Estêvão, Militão (Brazil) · Neymar in squad but calf doubt for MD1 · Kudus, Salisu (Ghana) · Gilmour (Scotland) · Kulusevski (Sweden) · de Ligt, Timber, Xavi Simons, Frimpong (Netherlands) · ter Stegen not picked, Neuer recalled (Germany) · Ekitike (France) · Azmoun (Iran) · Gnabry (Germany) · Openda (Belgium) · Malagón (Mexico) · Davies major doubt (Canada) · Güler major doubt MD1 (Türkiye) · Saka Achilles watch (England).";

const SCORING = [
 ["Played up to 60 min","1","1","1","1"],
 ["Played 60+ min","2","2","2","2"],
 ["Goal scored","9","7","6","5"],
 ["Goal from direct free kick","+1","+1","+1","+1"],
 ["Assist","3","3","3","3"],
 ["Winning a penalty","2","2","2","2"],
 ["Clean sheet (60+ min)","5","5","1","—"],
 ["Every 3 saves (GK)","1","—","—","—"],
 ["Penalty save (excl. shootout)","3","—","—","—"],
 ["1st goal conceded","0","0","—","—"],
 ["Each additional goal conceded","-1","-1","—","—"],
 ["Every 3 tackles","—","—","1","—"],
 ["Every 2 chances created","—","—","1","—"],
 ["Every 2 shots on target","—","—","—","1"],
 ["Conceding a penalty","-1","-1","-1","-1"],
 ["Yellow card","-1","-1","-1","-1"],
 ["Red card","-2","-2","-2","-2"],
 ["Own goal","-2","-2","-2","-2"],
 ["Scouting bonus (>4 pts & <5% owned)","+2","+2","+2","+2"],
];

const RULES_TEXT = [
 ["Squad & budget","15 players: 2 GK, 5 DEF, 5 MID, 3 FWD within $100m. Budget rises to $105m from the Round of 32. Prices are FIXED all tournament."],
 ["Nation limit","Max 3 players per nation through the group stage and R32, then 4 (R16), 5 (QF), 6 (SF), 8 (Final)."],

 ["Starting XI","Pick 11 in a valid formation (3-3 between defense, midfield, attack: e.g. 3-4-3, 4-4-2, 4-3-3, 5-3-2...). Bench scores nothing unless subbed in."],
 ["Captaincy","Captain scores DOUBLE. Vice-captain takes over only if the captain doesn't play at all (and you made no other live changes that matchday)."],
 ["Bonus: free-kick goals","A goal scored directly from a free kick earns +1 on top of the normal goal points — direct FK takers (FK badge) carry hidden upside."],
 ["Bonus: scouting bonus","+2 whenever one of YOUR players scores more than 4 points in a match while sitting in under 5% of all teams. Differentials literally pay extra — projections here already include this edge for sub-5% players."],
 ["Matchday subs","During a live round you can substitute a player who already played (and blanked) for one who hasn't played yet — a unique twist worth mastering."],
 ["Transfers","Unlimited until first kick-off (June 11). Group stage: 2 free transfers per MD (-3 pts each extra, 1 can carry over). R32: unlimited + budget rises to $105m. Then 4 free (R16, QF), 5 (SF), 6 (Final)."],

 ["Boosters","5 chips across 8 rounds, one active at a time (e.g. Wildcard, Max Captain/Triple Captain-style, Bench Boost-style). Don't stack them late — knockouts halve the player pool every round."],
 ["Key dates","Kick-off June 11 (Mexico City). Group MDs lock at first match of each round. R32 transfers open after Round 3 locks (budget becomes $105m)."],
];

/* ---------------- model ---------------- */
// Start probability from minutes played, per the official appearance bands.
function startProbFromMinutes(min){
  if(min==null) return null;
  if(min>=90) return 0.93;
  if(min>=45) return 0.78;
  if(min>=1)  return 0.55;
  return 0.35;
}
// The public feed exposes points but not per-player minutes. Points map back to a minutes band
// via the scoring rules: a 60+ min appearance is worth >=2 appearance pts, a sub-60 cameo exactly
// 1, and a goal/assist confirms a start. We never infer from 0/negative pts (ambiguous: benched,
// or played and netted out), so a curated start tier is never lowered without positive evidence.
function minutesFromPoints(pts, scoredOrAssisted){
  if(scoredOrAssisted) return 90;
  if(pts==null) return null;
  if(pts>=2) return 90;
  if(pts>=1) return 30;
  return null;
}
function buildModel(players, squads, rounds) {
  const meta = TEAM_META;
  const sq = {}; squads.forEach(s=>{ sq[s.id]={...s, ...meta[s.id]}; });

  // ---- actual tournament results from the live feed (all no-ops on the offline snapshot) ----
  // goals/assists come from each completed fixture's scorer list; per-team W/D/L and goals come
  // from the scores; per-player actual points come straight off the feed's stats block.
  const goalMap={}, assistMap={}, teamRes={}, teamCS={}, teamMP={};
  const blankRow=()=>({p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});
  (rounds||[]).forEach(r=>{
    const groupStage = r.id<=3;   // standings + clean sheets are a group-stage concept here
    (r.tournaments||[]).forEach(t=>{
      [t.homeGoalScorersAssists, t.awayGoalScorersAssists].forEach(arr=>{
        (arr||[]).forEach(g=>{ if(g.playerId!=null) goalMap[g.playerId]=(goalMap[g.playerId]||0)+1;
                               if(g.assistId!=null) assistMap[g.assistId]=(assistMap[g.assistId]||0)+1; });
      });
      const done = t.status==="complete" && t.homeScore!=null && t.awayScore!=null;
      if(done && groupStage){
        [[t.homeSquadId,t.homeScore,t.awayScore],[t.awaySquadId,t.awayScore,t.homeScore]].forEach(([id,gf,ga])=>{
          const row=teamRes[id]=teamRes[id]||blankRow();
          row.p++; row.gf+=gf; row.ga+=ga; row.gd=row.gf-row.ga;
          if(gf>ga){row.w++;row.pts+=3;} else if(gf===ga){row.d++;row.pts++;} else row.l++;
          teamMP[id]=(teamMP[id]||0)+1;
          if(ga===0) teamCS[id]=(teamCS[id]||0)+1;
        });
      }
    });
  });

  // group fixtures per squad from rounds 1-3
  const fixtures = {};
  rounds.slice(0,3).forEach((r,ri)=>{
    r.tournaments.forEach(t=>{
      [["home",t.homeSquadId,t.awaySquadId],["away",t.awaySquadId,t.homeSquadId]].forEach(([_,a,b])=>{
        (fixtures[a]=fixtures[a]||[]).push({round:ri+1, opp:b, date:t.date, venue:t.venueCity, score: t.homeSquadId===a? [t.homeScore,t.awayScore]:[t.awayScore,t.homeScore], status:t.status});
      });
    });
  });
  // per-team expected goals across 3 group games
  const teamX = {};
  Object.keys(sq).forEach(idS=>{
    const id=+idS; const elo=sq[id].elo;
    let xgf=0, xga=0, cs=0; const fx=(fixtures[id]||[]);
    fx.forEach(f=>{
      const d = elo - (sq[f.opp]?.elo||1500);
      const w = 1/(1+Math.pow(10, -d/400));
      const gf = 0.5 + 2.15*w, ga = 0.5 + 2.15*(1-w);
      f.diff = w; // for UI difficulty (higher = easier)
      xgf+=gf; xga+=ga; cs+=Math.exp(-ga);
    });
    teamX[id]={xgf,xga,cs,n:fx.length||3};
  });
  // start probability heuristic by team/pos rank, overridden by curated intel
  const byTeamPos = {};
  players.forEach(p=>{ (byTeamPos[p.squadId+p.position]=byTeamPos[p.squadId+p.position]||[]).push(p); });
  Object.values(byTeamPos).forEach(list=>list.sort((a,b)=> b.price-a.price || b.percentSelected-a.percentSelected));
  const startQ = {GK:[1,0.85,0.1],DEF:[4,0.72,0.2],MID:[4,0.7,0.22],FWD:[2,0.7,0.25]};
  // attacking weight within team
  const teamW = {};
  players.forEach(p=>{
    const intel = INTEL[p.id]||{};
    const list = byTeamPos[p.squadId+p.position];
    const idx = list.indexOf(p);
    const [q,hi,lo] = startQ[p.position];
    let st = intel.st!=null? intel.st : (idx<q? hi : idx===q? 0.42 : lo);
    // actual tournament participation signal for this player (live feed only)
    p._actPts = p.stats && typeof p.stats.totalPoints==="number" ? p.stats.totalPoints : null;
    p._scoredOrAssisted = !!(goalMap[p.id] || assistMap[p.id]);
    p._actMin = p.stats && typeof p.stats.minutesPlayed==="number" ? p.stats.minutesPlayed : null; // not in the public feed today, honoured if it appears
    // (3) auto start probability from results: override the curated/heuristic tier once we have evidence the player featured
    const proxyMin = p._actMin!=null ? p._actMin : minutesFromPoints(p._actPts, p._scoredOrAssisted);
    const fromResults = startProbFromMinutes(proxyMin);
    p._startAuto = fromResults!=null;
    if(fromResults!=null) st = fromResults;
    p._st = st;
    const sp = intel.sp||"";
    const posF = {FWD:1.3,MID:1.0,DEF:0.32,GK:0}[p.position];
    let w = Math.pow(Math.max(0.1,p.price-3.3),1.7)*posF*st;
    if(sp.includes("P")) w*=1.45;
    if(sp.includes("C")||sp.includes("F")) w*=1.15;
    p._w = w;
    teamW[p.squadId]=(teamW[p.squadId]||0)+w;
  });
  // raw model points (3 group games)
  players.forEach(p=>{
    const tx = teamX[p.squadId]; const share = p._w/(teamW[p.squadId]||1);
    const gInv = tx.xgf*share;                       // expected goal involvements
    const gPts = {GK:9,DEF:7,MID:6,FWD:5}[p.position];
    const att = gInv*(0.6*gPts + 0.45*3) + (p.position==="FWD"? 0.35*gInv : 0);
    const app = p._st*1.95*tx.n;
    let defPts = 0;
    if(p.position==="GK"||p.position==="DEF") defPts = tx.cs*5*p._st - 0.35*Math.max(0,tx.xga-tx.n)*p._st;
    if(p.position==="MID") defPts = tx.cs*1*p._st + 0.35*tx.n*p._st; // tackles + chances created floor
    let gk = 0;
    if(p.position==="GK") gk = (0.55 + Math.max(0,Math.min(0.9,(tx.xga-2.5)*0.35)))*tx.n*p._st;
    p._raw = att+app+defPts+gk;
  });
  // calibrate to expert projections (least squares scale)
  let num=0, den=0;
  players.forEach(p=>{ const rw=INTEL[p.id]?.rw; if(rw){ num+=p._raw*rw; den+=p._raw*p._raw; } });
  const k = den>0? num/den : 1;
  players.forEach(p=>{
    const rw=INTEL[p.id]?.rw;
    const model = p._raw*k;
    let proj = rw!=null? (rw*0.75)+(model*0.25) : model;
    // Official scouting bonus: +2 when a sub-5%-owned player scores >4 pts in a match
    p.scout = p.percentSelected < 5;
    if(p.scout){ const pg = proj/3; const prob = Math.max(0, Math.min(0.45, (pg-1.8)/5)); proj += 2*3*prob; }
    p.proj = Math.round(proj*10)/10;
    p.expert = rw||null;
    p.confidence = rw!=null? "expert" : "model";   // expert-backed when a RotoWire value exists, else model-only
    const prog = sq[p.squadId].prog;
    p.tourn = Math.round((p.proj*PROG_MULT[prog]/PROG_MULT.R32)*10)/10;
    p.value = Math.round(p.proj/p.price*100)/100;
    p.sp = INTEL[p.id]?.sp||"";
    p.note = INTEL[p.id]?.n||"";
    p.start = p._st;
    // team-level projected goals carried onto every player (shared across the squad, not per-player)
    const ptx = teamX[p.squadId];
    p.txg = ptx.xgf/ptx.n;      // goals for, per group game
    p.txgc = ptx.xga/ptx.n;     // goals conceded, per group game
    p.tcs = ptx.cs/ptx.n;       // clean-sheet probability, per group game (0-1)
    // actual tournament stats surfaced in the UI (all null/0 when offline or before kickoff)
    p.act = p._actPts;                       // actual fantasy points scored so far (null if no feed data)
    p.goals = goalMap[p.id]||0;
    p.assists = assistMap[p.id]||0;
    p.minutes = p._actMin;                   // null unless the feed exposes per-player minutes
    p.teamCS = teamCS[p.squadId]||0;         // team clean sheets so far (per-player CS needs minutes the feed lacks)
    p.matchesPlayed = teamMP[p.squadId]||0;  // completed group matches for the player's team
    p.startAuto = p._startAuto;              // true when start tier was auto-derived from results
    if(p.act!=null && p.matchesPlayed>0){
      const expected = p.proj*p.matchesPlayed/3;   // pro-rated share of the 3-game group projection
      p.actExpected = Math.round(expected*10)/10;
      const d = p.act-expected;
      p.actTone = d>=0.75? "up" : d<=-0.75? "down" : "flat";   // over/under vs pre-tournament projection
    } else { p.actExpected=null; p.actTone=null; }
  });
  // group standings: group letter -> rows sorted by pts, GD, GF, then Elo as the pre-tournament tiebreak
  const standings={};
  Object.values(sq).forEach(t=>{
    const row={...blankRow(), ...(teamRes[t.id]||{}), id:t.id, squad:t};
    (standings[t.group]=standings[t.group]||[]).push(row);
  });
  Object.values(standings).forEach(rows=>rows.sort((a,b)=> b.pts-a.pts || b.gd-a.gd || b.gf-a.gf || b.squad.elo-a.squad.elo));
  return {sq, fixtures, teamX, standings};
}

/* ---------------- tiny ui atoms ---------------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
:root{ --bg:#f6f6f3; --panel:#ffffff; --panel2:#f3f3ef; --line:#e7e7e1; --ink:#17181c; --dim:#7c7f88; --pitch:#16a34a; --pitchbg:#e7f6ec; --gold:#d99a06; --red:#e5484d; --amber:#d97706; --acc:#f97316; }
*{box-sizing:border-box; -webkit-tap-highlight-color:transparent}
body{margin:0}
.app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;padding-bottom:84px}
.disp{font-family:Inter,sans-serif;letter-spacing:-.01em}
.num{font-variant-numeric:tabular-nums}
.hdr{position:sticky;top:0;z-index:30;background:linear-gradient(180deg,var(--bg) 78%,rgba(246,246,243,0));padding:16px 16px 10px}
.hdr h1{margin:0;font-size:20px;font-weight:800;letter-spacing:-.02em}
.hdr h1 b{color:var(--pitch)}
.sub{color:var(--dim);font-size:12px;margin-top:3px}
.tabs{position:fixed;bottom:0;left:0;right:0;z-index:40;display:flex;background:#ffffffee;backdrop-filter:blur(10px);border-top:1px solid var(--line)}
.tab{flex:1;padding:10px 2px 12px;text-align:center;color:var(--dim);font-size:11px;font-weight:600;cursor:pointer;border:none;background:none;font-family:inherit}
.tab .ic{display:block;font-size:18px;margin-bottom:2px}
.tab.on{color:var(--pitch)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px;margin:0 12px 10px;box-shadow:0 1px 2px rgba(20,20,15,.04)}
.chip{display:inline-flex;align-items:center;gap:4px;padding:6px 13px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit}
.chip.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.row{display:flex;align-items:center;gap:10px}
.meter{height:5px;border-radius:3px;background:#e9e9e3;overflow:hidden;flex:1}
.meter>i{display:block;height:100%;border-radius:3px}
.badge{font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;letter-spacing:.04em}
.bp{background:#e7f6ec;color:#15803d}.bc{background:#eef4ff;color:#3b6fd4}.bf{background:#fff3e4;color:#c2640a}
.btn{border:none;border-radius:12px;padding:10px 15px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit}
.btn.g{background:var(--pitch);color:#fff}.btn.ghost{background:var(--panel);color:var(--ink);border:1px solid var(--line)}
.btn.r{background:#fdebec;color:var(--red)}
.btn:disabled{opacity:.4}
input,select{background:var(--panel);border:1px solid var(--line);color:var(--ink);border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit;outline:none}
input:focus{border-color:var(--pitch)}
.pillrow{display:flex;gap:7px;overflow-x:auto;padding:4px 12px 8px;scrollbar-width:none}
.pillrow::-webkit-scrollbar{display:none}
.prow{display:flex;align-items:center;gap:9px;padding:8px 12px;border-bottom:1px solid var(--line);cursor:pointer}
.prow.owned{background:var(--pitchbg)}
.prow:last-child{border-bottom:none}
.pname{font-weight:600;font-size:14.5px;line-height:1.15}
.pmeta{color:var(--dim);font-size:11.5px;margin-top:2px}
.bigpt{font-size:20px;font-weight:800;line-height:1;letter-spacing:-.02em}
.fade{color:var(--dim)}
.note{font-size:11.5px;color:var(--amber);margin-top:3px;line-height:1.3}
.slot{display:flex;align-items:center;gap:8px;background:var(--panel2);border:1px dashed #d9d9d2;border-radius:12px;padding:8px 10px;margin-bottom:6px}
.slot.full{border-style:solid;background:var(--panel);border-color:var(--line)}
.cap{background:var(--gold);color:#fff;font-size:10px;font-weight:800;border-radius:5px;padding:1px 5px}
.vc{background:#e4e4de;color:#54565e;font-size:10px;font-weight:800;border-radius:5px;padding:1px 5px}
.msg{max-width:88%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.45;white-space:pre-wrap}
.msg.u{background:var(--ink);color:#fff;margin-left:auto;border-bottom-right-radius:5px}
.msg.a{background:var(--panel);border:1px solid var(--line);border-bottom-left-radius:5px}
table.sc{width:100%;border-collapse:collapse;font-size:13px}
table.sc td,table.sc th{padding:7px 6px;border-bottom:1px solid var(--line);text-align:center}
table.sc td:first-child{text-align:left;color:var(--dim)}
.grp{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 12px}
/* groups have exactly 4 teams: 2 cols on mobile (2+2), 4 cols on desktop (one tidy row) - avoids the lopsided 3+1 */
@media(min-width:760px){.grp{grid-template-columns:repeat(4,1fr);gap:12px}.app{max-width:1120px;margin:0 auto}}
.tcard{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:11px;cursor:pointer;box-shadow:0 1px 2px rgba(20,20,15,.04);transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease}
@media(hover:hover){.tcard:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(20,20,15,.10);border-color:#d7e9dc}}
.gl{font-weight:700;color:var(--dim);font-size:11px;letter-spacing:.1em}
.spin{display:inline-block;width:18px;height:18px;border:2px solid var(--line);border-top-color:var(--pitch);border-radius:50%;animation:sp 1s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.fixdot{width:9px;height:9px;border-radius:50%;display:inline-block}
.searchbar{display:flex;gap:8px;padding:0 12px 8px}
.searchbar input{flex:1}
.sticky2{position:sticky;top:58px;z-index:25;background:var(--bg);padding-top:4px}
.draftcard{border:1.5px solid var(--pitch);background:var(--pitchbg);border-radius:16px;padding:12px;margin-top:8px}
.conf{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:6px;letter-spacing:.02em;white-space:nowrap;display:inline-block}
.conf.exp{background:#e7f6ec;color:#15803d}
.conf.mod{background:#ededea;color:#7c7f88}
.stag{font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;letter-spacing:.02em;white-space:nowrap;display:inline-block}
.st-n{background:#e7f6ec;color:#15803d}.st-l{background:#eef7e1;color:#4d7c0f}.st-t{background:#fff3e4;color:#c2640a}.st-d{background:#fdecec;color:#cf4a4a}.st-b{background:#edece9;color:#7c7f88}
.tchip{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap;font-variant-numeric:tabular-nums;cursor:help}
.tone-slate{background:#eef0f3;color:#475569}.tone-green{background:#e7f6ec;color:#15803d}.tone-amber{background:#fff3e4;color:#c2640a}.tone-red{background:#fdecec;color:#cf4a4a}.tone-gold{background:#fbefcf;color:#a9780a}.tone-blue{background:#eaf1ff;color:#3b6fd4}.tone-violet{background:#f1ebfd;color:#7c3aed}
.tchiprow{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}
.mchip-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
.mchip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;border:1px solid transparent;box-shadow:0 1px 2px rgba(20,20,15,.06);cursor:help;line-height:1}
.mchip .ic{font-size:13px;line-height:1;filter:saturate(1.1)}
.mchip .lab{font-weight:600;opacity:.62;font-size:10px;letter-spacing:.01em}
.mc-slate{background:linear-gradient(135deg,#f5f6f9,#e8ebf1);color:#475569;border-color:#dde2ea}
.mc-blue{background:linear-gradient(135deg,#eef4ff,#dbe8ff);color:#2f5fc4;border-color:#cfe0ff}
.mc-green{background:linear-gradient(135deg,#eafaf0,#d4f2df);color:#15803d;border-color:#bdeccd}
.mc-amber{background:linear-gradient(135deg,#fff6e9,#ffe8c9);color:#b4640a;border-color:#f9d9aa}
.mc-red{background:linear-gradient(135deg,#fdeeee,#fbd9d9);color:#cf3a3f;border-color:#f4c6c6}
.mc-gold{background:linear-gradient(135deg,#fdf3d6,#f6e4a6);color:#946b05;border-color:#edd693}
.mc-violet{background:linear-gradient(135deg,#f3edfd,#e6d9fb);color:#7c3aed;border-color:#dbc9f6}
.mc-ink{background:linear-gradient(135deg,#33353c,#17181c);color:#fff;border-color:#0c0d10}
.mc-ink .lab{opacity:.7}
.appfoot{display:flex;justify-content:center;flex-wrap:wrap;gap:8px 16px;padding:12px 12px 18px;margin-top:4px}
.appfoot a{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--dim);text-decoration:none;white-space:nowrap;transition:color .15s}
.appfoot a:hover{color:var(--acc)}
.coffee{display:inline-block;font-size:12px;font-weight:600;color:var(--dim);text-decoration:none;padding:5px 12px;border-radius:999px;border:1px solid var(--line);background:var(--panel);transition:color .15s,border-color .15s}
.coffee:hover{color:var(--acc);border-color:var(--acc)}
.hdr-coffee{flex-shrink:0;font-size:11.5px;font-weight:600;color:var(--dim);text-decoration:none;white-space:nowrap;padding:4px 9px;border-radius:999px;border:1px solid var(--line);background:var(--panel);transition:color .15s,border-color .15s;margin-top:2px}
.hdr-coffee:hover{color:var(--acc);border-color:var(--acc)}
@media(max-width:430px){.hdr-coffee-txt{display:none}}
.viewtog{display:flex;gap:7px;padding:2px 12px 10px}
.pitch{position:relative;overflow:hidden;border-radius:18px;margin:0 12px 10px;padding:22px 8px 16px;background:linear-gradient(180deg,#2aa55c 0%,#1c9450 55%,#15803d 100%);box-shadow:0 1px 3px rgba(20,40,20,.18)}
.pitch .stripes{position:absolute;inset:0;z-index:0;background:repeating-linear-gradient(180deg,rgba(255,255,255,.06) 0 30px,rgba(0,0,0,.03) 30px 60px)}
.pitch .lines{position:absolute;left:7%;right:7%;top:5%;bottom:1%;z-index:0;border:2px solid rgba(255,255,255,.42);border-radius:7px;transform:perspective(680px) rotateX(20deg);transform-origin:50% 100%}
.pitch .lines::before{content:"";position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;border:2px solid rgba(255,255,255,.42);border-radius:50%}
.pitch .lines::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(255,255,255,.42)}
.pitch .pbox{position:absolute;left:30%;right:30%;height:15%;border:2px solid rgba(255,255,255,.38);z-index:0;transform:perspective(680px) rotateX(20deg);transform-origin:50% 100%}
.pitch .pbox.top{top:5%;border-top:none}
.pitch .pbox.bot{bottom:1%;border-bottom:none}
.prow-p{position:relative;z-index:1;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:12px 0}
.ptok{position:relative;width:66px;min-height:44px;cursor:pointer;display:flex;flex-direction:column;align-items:center}
.jersey{position:relative;width:46px;height:42px;display:flex;align-items:flex-start;justify-content:center;background:linear-gradient(160deg,#fdfdfd,#dfe3e8);clip-path:polygon(30% 0,70% 0,78% 7%,100% 20%,87% 44%,74% 31%,74% 100%,26% 100%,26% 31%,13% 44%,0 20%,22% 7%);filter:drop-shadow(0 2px 2px rgba(8,20,12,.32))}
.jersey::before{content:"";position:absolute;top:0;left:39%;width:22%;height:14%;background:rgba(0,0,0,.13);clip-path:polygon(0 0,100% 0,50% 100%)}
.jersey .crest{font-size:15px;margin-top:6px;line-height:1}
.ptok-card{margin-top:-2px;background:#fff;border-radius:7px;padding:3px 4px 4px;width:100%;text-align:center;box-shadow:0 1px 2px rgba(8,20,12,.25)}
.ptok .pn{font-size:10.5px;font-weight:700;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink)}
.ptok .pp{font-size:9.5px;color:var(--dim);margin-top:1px;font-variant-numeric:tabular-nums}
.ptok .png{font-size:8.5px;color:var(--pitch);font-weight:700;margin-top:1px;font-variant-numeric:tabular-nums}
.ptok .fixchip{margin-top:3px;justify-content:center}
.ptok-x{position:absolute;top:-6px;left:-6px;z-index:3;width:19px;height:19px;border-radius:50%;background:#fff;color:var(--dim);font-size:11px;line-height:19px;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.28)}
.ptok-cv{position:absolute;top:-7px;right:-6px;z-index:3;box-shadow:0 1px 2px rgba(0,0,0,.28)}
.ptok.empty .jersey{background:rgba(255,255,255,.16);filter:none}
.ptok.empty .jersey::before{display:none}
.ptok.empty .jersey .crest{font-size:18px;color:#eafff1;margin-top:8px}
.ptok.empty .ptok-card{background:rgba(255,255,255,.16)}
.ptok.empty .pn{color:#eafff1;font-weight:600}
.fixchip{display:inline-flex;gap:3px;align-items:center;vertical-align:middle}
.actbadge{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:800;padding:2px 7px;border-radius:6px;background:#101113;color:#fff;font-variant-numeric:tabular-nums;letter-spacing:.01em}
.actbadge .arr{font-size:10px;font-weight:900;line-height:1}
.arr-up{color:#39d98a}.arr-down{color:#ff7a7a}
.resbadge{font-size:10px;font-weight:800;padding:1px 6px;border-radius:6px;letter-spacing:.04em}
.res-w{background:#e7f6ec;color:#15803d}.res-d{background:#fdf3d6;color:#946b05}.res-l{background:#fdecec;color:#cf3a3f}
table.sc tr.qual td{background:#eafaf0}
table.sc tr.qual td:first-child{box-shadow:inset 3px 0 0 var(--pitch)}
table.sc tr.out td:first-child{box-shadow:inset 3px 0 0 #d9d9d2}
table.sc .tn{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--ink)}
.stbox{margin-top:12px;background:var(--panel2);border-radius:12px;padding:10px 12px}
.stgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.stgrid .cell{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:8px 4px;text-align:center}
.stgrid .cell .v{font-size:17px;font-weight:800;font-variant-numeric:tabular-nums;line-height:1}
.stgrid .cell .l{font-size:9.5px;color:var(--dim);margin-top:3px}
.verline{flex-basis:100%;text-align:center;font-size:11px;color:var(--dim);font-weight:600;font-variant-numeric:tabular-nums}
`;

function SpBadges({sp}) {
  if(!sp) return null;
  return <span style={{display:"inline-flex",gap:3,marginLeft:5}}>
    {sp.includes("P")&&<span className="badge bp">PEN</span>}
    {sp.includes("C")&&<span className="badge bc">CRN</span>}
    {sp.includes("F")&&<span className="badge bf">FK</span>}
  </span>;
}
function pName(p){ return p.knownName || `${(p.firstName||"")[0]||""}. ${p.lastName||""}`; }
function fullName(p){ return p.knownName || `${p.firstName||""} ${p.lastName||""}`.trim(); }
function ConfidenceTag({c}){
  return c==="expert"
    ? <span className="conf exp" title="Blends an expert (RotoWire) group-stage projection">expert-backed</span>
    : <span className="conf mod" title="Model estimate only — no expert projection for this player">model estimate</span>;
}
// Start likelihood as a clear tier tag rather than a falsely-precise percentage.
function startTier(v){
  return v>=0.88? {label:"Nailed",cls:"st-n"} : v>=0.65? {label:"Likely",cls:"st-l"}
       : v>=0.45? {label:"Toss-up",cls:"st-t"} : v>=0.25? {label:"Doubt",cls:"st-d"} : {label:"Bench",cls:"st-b"};
}
function StartTag({v}){ const s=startTier(v); return <span className={"stag "+s.cls} title="Projected starting likelihood">{s.label}</span>; }
function Chip({tone="slate", title, children}){ return <span className={"tchip tone-"+tone} title={title}>{children}</span>; }
const PROG_TONE={TITLE:"gold",SF:"violet",QF:"violet",R16:"blue",R32:"slate"};
function eloTone(e){ return e>=1950?"green":e>=1820?"blue":e>=1680?"amber":"red"; }
// one-word strength read on the Elo number, for the chip's trailing label
function eloWord(e){ return e>=1950?"Elite":e>=1820?"Strong":e>=1680?"Solid":e>=1500?"Outsider":"Underdog"; }
const PROG_ICON={TITLE:"🏆",SF:"🔥",QF:"⭐",R16:"📈",R32:"🎯"};
// quality-based tones for the projected-goals chips (so colour itself carries meaning)
function xgTone(v){ return v>=2.1?"green":v>=1.5?"blue":v>=1.1?"amber":"slate"; }   // attack: higher = better
function xgcTone(v){ return v<=0.9?"green":v<=1.3?"amber":"red"; }                   // defence: lower = better
function csTone(p){ return p>=40?"green":p>=28?"blue":p>=18?"amber":"slate"; }       // clean-sheet odds
// creative pill chip: leading icon + value + faint trailing label, coloured by tone
function StatChip({tone="slate", icon, title, label, children}){
  return <span className={"mchip mc-"+tone} title={title}>
    {icon&&<span className="ic">{icon}</span>}<span>{children}</span>
    {label&&<span className="lab">{label}</span>}</span>;
}
// fixture difficulty colour from the Elo win-prob stored on each fixture (higher = easier)
function fixColor(d){ return d>0.62? "var(--pitch)" : d>0.42? "var(--amber)" : "var(--red)"; }
function FixtureDots({squadId, fixtures, sq, max=3}){
  const fx=(fixtures?.[squadId]||[]).slice(0,max);
  if(!fx.length) return null;
  return <span className="fixchip" title="Next fixtures · Elo difficulty (green easy, red hard)">
    {fx.map((f,i)=><span key={i} className="fixdot" title={sq[f.opp]?.name} style={{background:fixColor(f.diff)}}/>)}
  </span>;
}
function fmtDate(d){ return new Date(d).toLocaleDateString(undefined,{month:"short",day:"numeric"}); }
// next upcoming fixture for a team (earliest one still in the future), formatted like "Jun 12";
// null when none remain. Filtering to future dates keeps this the NEXT game once matchdays start,
// not the team's first game of the tournament.
function nextFixtureDate(squadId, fixtures){
  const upcoming = (fixtures?.[squadId]||[]).filter(f=> new Date(f.date).getTime() >= Date.now());
  if(!upcoming.length) return null;
  const next = upcoming.reduce((a,b)=> new Date(b.date) < new Date(a.date) ? b : a);
  return fmtDate(next.date);
}

/* ---------------- player row ---------------- */
function PlayerRow({p, sq, onAdd, inTeam, onOpen, points, pointsLabel, fixtures, lockReason}) {
  const nd = nextFixtureDate(p.squadId, fixtures);
  return (
    <div className={"prow"+(inTeam?" owned":"")} style={lockReason?{opacity:.5}:null} onClick={()=> lockReason ? null : (onOpen&&onOpen(p))}>
      <div style={{width:30,textAlign:"center",fontSize:19,flexShrink:0}}>{FLAGS[sq[p.squadId].abbr]||"⚽"}</div>
      <div style={{flex:1,minWidth:0}}>
        <div className="pname" style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span>{fullName(p)}</span><SpBadges sp={p.sp}/><StartTag v={p.start}/>
          {p.act!=null && <span className="actbadge" title={p.actExpected!=null? `Actual ${p.act} pts vs ${p.actExpected} projected so far` : "Actual tournament points scored so far"}>
            {p.act} pts{(p.actTone==="up"||p.actTone==="down")&&<span className={"arr arr-"+p.actTone}>{p.actTone==="up"?"▲":"▼"}</span>}
          </span>}
        </div>
        <div className="pmeta num" style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginTop:2}}>
          <span>{p.position} · {sq[p.squadId].abbr} · ${p.price}m · {p.percentSelected}%</span>
          <FixtureDots squadId={p.squadId} fixtures={fixtures} sq={sq}/>
          {nd && <span style={{color:"var(--pitch)",fontWeight:700}}>{nd}</span>}
          <ConfidenceTag c={p.confidence}/>
        </div>
        {p.note && <div className="note">⚠ {p.note}</div>}
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div className="bigpt num" style={{color:"var(--pitch)",fontSize:18}}>{points!=null? points : p.proj}</div>
        <div style={{fontSize:9,color:"var(--dim)",letterSpacing:".06em"}}>{points!=null?(pointsLabel||"PTS"):"PROJ"}</div>
        {lockReason && <div style={{fontSize:9,color:"var(--red)",fontWeight:700,marginTop:2}}>{lockReason}</div>}
        {onAdd && <button className={"btn "+(inTeam?"r":"ghost")} style={{padding:"4px 9px",marginTop:4,fontSize:12}}
          onClick={e=>{e.stopPropagation();onAdd(p);}}>{inTeam?"Remove":"+ Add"}</button>}
      </div>
    </div>
  );
}

/* ---------------- main app ---------------- */
function App() {
  const [tab,setTab]=useState("players");
  const [data,setData]=useState(null);
  const [err,setErr]=useState(null);
  const [team,setTeam]=useState(null);           // selected team page
  const [myIds,setMyIds]=useState([]);
  const [cap,setCap]=useState(null);
  const [vc,setVc]=useState(null);
  const [detail,setDetail]=useState(null);       // player detail sheet
  const [picker,setPicker]=useState(null);       // {out, position} for the in-place selection sheet
  const [chat,setChat]=useState([GREETING]);

  // --- Android / browser back button -------------------------------------------------
  // Opening a sub-view (team page, player detail sheet, selection sheet) pushes a history
  // entry. Pressing back fires popstate; we close the topmost open sub-view instead of
  // leaving the app. Every close routes through goBack() so history stays 1:1 with views.
  const pushView = (view)=>{ try{ window.history.pushState({view}, ""); }catch(e){} };
  const openTeam   = (t)=>{ pushView("team");   setTeam(t); };
  const openDetail = (p)=>{ pushView("detail"); setDetail(p); };
  const openPicker = (slot)=>{ pushView("picker"); setPicker(slot); };
  const goBack = ()=>{ try{ window.history.back(); }catch(e){ setPicker(null); setDetail(null); setTeam(null); } };
  useEffect(()=>{
    const onPop = ()=>{                 // close only the topmost open sub-view (innermost first)
      if(picker) setPicker(null);
      else if(detail) setDetail(null);
      else if(team) setTeam(null);
    };
    window.addEventListener("popstate", onPop);
    return ()=>window.removeEventListener("popstate", onPop);
  },[team, detail, picker]);

  // chat persistence
  useEffect(()=>{ (async()=>{ try{
    const r = await store.get("wc26-chat");
    if(r?.value){ const c=JSON.parse(r.value); if(Array.isArray(c)&&c.length) setChat(c); }
  }catch(e){} })(); },[]);
  const setChatPersist = (next)=>{
    setChat(prev=>{
      const v = typeof next==="function"? next(prev) : next;
      try{ store.set("wc26-chat", JSON.stringify(v.slice(-40))); }catch(e){}
      return v;
    });
  };

  useEffect(()=>{ (async()=>{
    // 1) Instant load from embedded official snapshot (June 10; prices are fixed all tournament)
    try{
      const {players, squads, rounds} = expandSnap();
      const m = buildModel(players, squads, rounds);
      setData({players, ...m, rounds, live:false});
    }catch(e){ setErr("Failed to initialise app data."); }
    // 2) Try live refresh from play.fifa.com (works when network is allowed; silently keep snapshot otherwise)
    try{
      const [pl,sqd,rd] = await Promise.all([
        fetch("https://play.fifa.com/json/fantasy/players.json").then(r=>r.json()),
        fetch("https://play.fifa.com/json/fantasy/squads.json").then(r=>r.json()),
        fetch("https://play.fifa.com/json/fantasy/rounds.json").then(r=>r.json()),
      ]);
      const players = pl.filter(p=>p.status==="playing");
      const m = buildModel(players, sqd, rd);
      setData({players, ...m, rounds:rd, live:true});
    }catch(e){ /* offline/sandboxed: embedded snapshot already shown */ }
  })(); },[]);

  useEffect(()=>{ (async()=>{ try{
    const r = await store.get("wc26-team");
    if(r?.value){ const t=JSON.parse(r.value); setMyIds(t.ids||[]); setCap(t.cap); setVc(t.vc); }
  }catch(e){} })(); },[]);
  const persist = async (ids,c,v)=>{ try{ await store.set("wc26-team", JSON.stringify({ids,cap:c,vc:v})); }catch(e){} };

  const toggle = (p)=>{
    let ids=[...myIds];
    if(ids.includes(p.id)) ids=ids.filter(i=>i!==p.id);
    else{
      if(ids.length>=15) return alert("Squad is full (15). Remove someone first.");
      const squad = ids.map(i=>data.players.find(x=>x.id===i));
      if(squad.filter(x=>x.position===p.position).length>=QUOTA[p.position]) return alert(`Position full: max ${QUOTA[p.position]} ${p.position}.`);
      if(squad.filter(x=>x.squadId===p.squadId).length>=NATION_MAX) return alert("Max 3 players per nation in the group stage.");
      const cost = squad.reduce((s,x)=>s+x.price,0)+p.price;
      if(cost>BUDGET) return alert(`Over budget: that takes you to $${cost.toFixed(1)}m / $100m.`);
      ids.push(p.id);
    }
    let c=cap,v=vc;
    if(c&&!ids.includes(c)) c=null;
    if(v&&!ids.includes(v)) v=null;
    setMyIds(ids); setCap(c); setVc(v); persist(ids,c,v);
  };

  // Swap one player out for another. The replacement list is pre-filtered for legality,
  // so this just applies the move and drops captaincy if the captain/vice left.
  const swap = (outP, inP)=>{
    const ids = myIds.filter(i=>i!==outP.id);
    ids.push(inP.id);
    let c = cap===outP.id? null : cap;
    let v = vc===outP.id? null : vc;
    setMyIds(ids); setCap(c); setVc(v); persist(ids,c,v);
  };

  if(err) return <div className="app"><style>{css}</style><div className="card" style={{marginTop:60}}>{err}</div></div>;
  if(!data) return <div className="app"><style>{css}</style>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"70vh",gap:14}}>
      <div className="spin"/><div className="fade" style={{fontSize:13}}>Loading squads, prices & fixtures…</div>
    </div></div>;

  const {players, sq, fixtures, teamX, standings} = data;
  const mySquad = myIds.map(i=>players.find(p=>p.id===i)).filter(Boolean);

  return (
    <div className="app">
      <style>{css}</style>
      <div className="hdr">
        <div className="row" style={{justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <div style={{minWidth:0,flex:1}}>
            <h1 className="disp">WC26 <b>FANTASY</b> HUB</h1>
            <div className="sub" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Official prices ({data.live? "live" : "snapshot Jun 10"}) · 48 teams · {players.length} players · v{APP_VERSION}</div>
          </div>
          <a className="hdr-coffee" href="https://buymeacoffee.com/sma6871" target="_blank" rel="noopener noreferrer" title="Support this tool">☕ <span className="hdr-coffee-txt">Support this tool</span></a>
        </div>
      </div>

      {tab==="teams" && (team
        ? <TeamPage t={team} back={goBack} players={players} sq={sq} fixtures={fixtures} teamX={teamX} standings={standings} toggle={toggle} myIds={myIds} openP={openDetail}/>
        : <TeamsGrid sq={sq} setTeam={openTeam} players={players} standings={standings}/>)}
      {tab==="players" && <PlayersView players={players} sq={sq} toggle={toggle} myIds={myIds} openP={openDetail} fixtures={fixtures}/>}
      {tab==="myteam" && <MyTeam squad={mySquad} sq={sq} toggle={toggle} cap={cap} vc={vc} fixtures={fixtures}
        setCapVc={(c,v)=>{setCap(c);setVc(v);persist(myIds,c,v);}}
        onPick={(out,position)=>openPicker({out, position: position || (out&&out.position)})}/>}
      {tab==="coach" && (COACH_MODE==="off"
        ? <CoachWaitlist/>
        : <Coach players={players} sq={sq} mySquad={mySquad} cap={cap}
            msgs={chat} setMsgs={setChatPersist}
            onApply={(ids,c,v)=>{ setMyIds(ids); setCap(c); setVc(v); persist(ids,c,v); setTab("myteam"); }}/>)}
      {tab==="rules" && <Rules/>}

      <footer className="appfoot">
        <a href="https://github.com/sma6871/wc26-fantasy-hub" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          GitHub</a>
        <a href="https://x.com/MasFPL" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          @MasFPL</a>
        <a href="https://buymeacoffee.com/sma6871" target="_blank" rel="noopener noreferrer">☕ Buy me a coffee</a>
        <span className="verline">v{APP_VERSION} · updated {APP_UPDATED}</span>
      </footer>

      {detail && <Detail p={detail} sq={sq} fixtures={fixtures} close={goBack} toggle={toggle} inTeam={myIds.includes(detail.id)}/>}
      {picker && <SelectSheet slot={picker} mySquad={mySquad} players={players} sq={sq} fixtures={fixtures}
        close={goBack}
        onPick={(cand)=>{ picker.out ? swap(picker.out,cand) : toggle(cand); goBack(); }}
        onRemove={()=>{ if(picker.out) toggle(picker.out); goBack(); }}/>}

      <nav className="tabs">
        {[["teams","🏟️","Teams"],["players","🔎","Players"],["myteam","📋","My Team"],["coach","🧠","AI Coach"],["rules","📖","Rules"]].map(([k,ic,l])=>
          <button key={k} className={"tab"+(tab===k?" on":"")} onClick={()=>{ setTab(k); if(team) goBack(); }}>
            <span className="ic">{ic}</span>{l}{k==="myteam"&&myIds.length>0?` (${myIds.length})`:""}
          </button>)}
      </nav>
    </div>
  );
}

/* ---------------- teams ---------------- */
// completed-fixture result from a team's perspective: {g, a, res:[label, cssClass]} or null
function fixtureResult(f){
  const done = f && f.status==="complete" && f.score && f.score[0]!=null && f.score[1]!=null;
  if(!done) return null;
  const [g,a]=f.score;
  return {g, a, res: g>a? ["W","res-w"] : g===a? ["D","res-d"] : ["L","res-l"]};
}

// Group standings table, computed from completed fixtures. Top 2 (qualify) highlighted vs bottom 2.
function GroupTable({group, standings, sq}){
  const rows = standings && standings[group];
  if(!rows || !rows.length) return null;
  const played = rows.some(r=>r.p>0);
  return <div className="card">
    <div className="row" style={{justifyContent:"space-between",marginBottom:8}}>
      <div className="gl">GROUP {group.toUpperCase()} TABLE</div>
      <div className="pmeta">{played? "live standings" : "fixtures to come"}</div>
    </div>
    <table className="sc">
      <thead><tr><th style={{textAlign:"left"}}>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={r.id} className={i<2?"qual":"out"}>
            <td><span className="tn">{FLAGS[r.squad.abbr]||"⚽"} {r.squad.abbr}</span></td>
            <td>{r.p}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td><td>{r.gf}</td><td>{r.ga}</td>
            <td>{r.gd>0?"+":""}{r.gd}</td><td style={{fontWeight:800}}>{r.pts}</td>
          </tr>))}
      </tbody>
    </table>
    <div className="pmeta" style={{marginTop:7}}>● top 2 advance · ranked by points, then goal difference</div>
  </div>;
}

function TeamsGrid({sq, setTeam, players, standings}) {
  const groups={};
  Object.values(sq).forEach(t=>{ (groups[t.group]=groups[t.group]||[]).push(t); });
  const best={};
  players.forEach(p=>{ if(!best[p.squadId]||p.proj>best[p.squadId].proj) best[p.squadId]=p; });
  return <>
    {Object.keys(groups).sort().map(g=>(
      <div key={g} style={{marginBottom:14}}>
        <div className="gl" style={{padding:"4px 16px 8px"}}>GROUP {g.toUpperCase()}</div>
        <GroupTable group={g} standings={standings} sq={sq}/>
        <div className="grp">
          {groups[g].sort((a,b)=>b.elo-a.elo).map(t=>(
            <div key={t.id} className="tcard" onClick={()=>setTeam(t)}>
              <div className="row"><span style={{fontSize:24}}>{FLAGS[t.abbr]||"⚽"}</span>
                <div><div className="pname disp" style={{fontSize:16}}>{t.name}</div>
                <div className="pmeta num">Elo {t.elo} · {PROG_LABEL[t.prog]}</div></div></div>
              {best[t.id]&&<div className="pmeta" style={{marginTop:7}}>★ {fullName(best[t.id])} <span className="num" style={{color:"var(--pitch)"}}>{best[t.id].proj}</span></div>}
            </div>))}
        </div>
      </div>))}
  </>;
}

function FixtureStrip({t, sq, fixtures}) {
  const fx=(fixtures[t.id]||[]);
  return <div className="card">
    <div className="gl" style={{marginBottom:8}}>GROUP FIXTURES</div>
    {fx.map((f,i)=>{
      const col = fixColor(f.diff);
      const r = fixtureResult(f);
      return <div key={i} className="row" style={{padding:"6px 0",borderBottom:i<fx.length-1?"1px solid var(--line)":"none"}}>
        <span className="fixdot" style={{background:col}}/>
        <span style={{fontSize:16}}>{FLAGS[sq[f.opp].abbr]}</span>
        <span style={{flex:1,fontSize:14,fontWeight:600}}>{sq[f.opp].name}</span>
        {r
          ? <><span className="num" style={{fontSize:14,fontWeight:800}}>{r.g}–{r.a}</span><span className={"resbadge "+r.res[1]}>{r.res[0]}</span></>
          : <span className="pmeta num">{fmtDate(f.date)} · {f.venue}</span>}
      </div>;})}
    <div className="pmeta" style={{marginTop:7}}>● green = favourable matchup (Elo-based)</div>
  </div>;
}

function TeamPage({t, back, players, sq, fixtures, teamX, standings, toggle, myIds, openP}) {
  const [sort,setSort]=useState("proj");
  useEffect(()=>{ try{ window.scrollTo(0,0); }catch(e){} },[t.id]);   // open a team scrolled to the top
  const list = players.filter(p=>p.squadId===t.id)
    .sort((a,b)=> sort==="proj"? b.proj-a.proj : sort==="act"? (b.act??-1)-(a.act??-1) : sort==="start"? b.start-a.start : sort==="price"? b.price-a.price : b.percentSelected-a.percentSelected);
  // per-group-game projected goals from the Elo model (xG for, xG conceded, clean-sheet odds)
  const tx = teamX && teamX[t.id];
  const xgpg = tx ? tx.xgf/tx.n : null;     // projected goals for, per group game
  const xgcpg = tx ? tx.xga/tx.n : null;    // projected goals conceded, per group game
  const cspg = tx ? Math.round(tx.cs/tx.n*100) : null;
  return <>
    <div className="card">
      <div className="row">
        <button className="btn ghost" style={{padding:"6px 11px"}} onClick={back}>←</button>
        <span style={{fontSize:30}}>{FLAGS[t.abbr]}</span>
        <div style={{flex:1,minWidth:0}}>
          <div className="disp" style={{fontSize:20,fontWeight:700}}>{t.name}</div>
          <div className="pmeta">Group {t.group.toUpperCase()} stage outlook</div>
        </div>
      </div>
      <div className="mchip-row">
        <StatChip tone="ink" icon="🌍" title="Group-stage draw">Group {t.group.toUpperCase()}</StatChip>
        <StatChip tone={eloTone(t.elo)} icon="📊" label={eloWord(t.elo)}
          title="Elo rating: a single number for overall team strength. About 1500 is average, 1800+ is strong, 2000+ is world-class. The model uses it to estimate each match's win and clean-sheet odds.">
          Elo {t.elo}</StatChip>
        <StatChip tone={PROG_TONE[t.prog]} icon={PROG_ICON[t.prog]}
          title="How far the model expects this team to advance. It scales each player's knockout (deep-run) projected points.">
          {PROG_LABEL[t.prog]}</StatChip>
      </div>
      {tx && <div className="mchip-row">
        <StatChip tone={xgTone(xgpg)} icon="⚽" label="/ game"
          title="Projected goals scored per group game (xG), from the Elo matchup model. Higher is better.">
          {xgpg.toFixed(1)} xG</StatChip>
        <StatChip tone={xgcTone(xgcpg)} icon="🥅" label="/ game"
          title="Projected goals conceded per group game (xGC), from the Elo matchup model. Lower is better.">
          {xgcpg.toFixed(1)} xGC</StatChip>
        <StatChip tone={csTone(cspg)} icon="🛡️" label="per game"
          title="Clean-sheet probability per group game, derived from projected goals conceded.">
          {cspg}% CS</StatChip>
      </div>}
    </div>
    <GroupTable group={t.group} standings={standings} sq={sq}/>
    <FixtureStrip t={t} sq={sq} fixtures={fixtures}/>
    <div className="pillrow">
      {[["proj","Projected pts"],["act","Actual pts"],["start","Starting XI"],["price","Price"],["sel","Ownership"]].map(([k,l])=>
        <button key={k} className={"chip"+(sort===k?" on":"")} onClick={()=>setSort(k)}>{l}</button>)}
    </div>
    <div className="card" style={{padding:0}}>
      {list.map(p=><PlayerRow key={p.id} p={p} sq={sq} onAdd={toggle} inTeam={myIds.includes(p.id)} onOpen={openP} fixtures={fixtures}/>)}
    </div>
  </>;
}

/* ---------------- shared player filtering (Players tab + selection sheet) ---------------- */
const SORT_OPTS=[["proj","Proj pts"],["act","Actual pts"],["deep","Deep-run pts"],["value","Value /$"],["start","Nailed"],["price","Price"],["sel","Owned %"],["xg","Team xG"],["xgc","Team xGC"],["cs","Clean sheet"]];
// all keys sorted descending (key(b)-key(a)); xGC is negated so the best (lowest) defences come first
const SORT_KEY={proj:p=>p.proj, act:p=>(p.act??-1), value:p=>p.value, price:p=>p.price, sel:p=>p.percentSelected, start:p=>p.start, deep:p=>p.tourn, xg:p=>p.txg, xgc:p=>-p.txgc, cs:p=>p.tcs};
const PRICE_OPTS=[["≤4.5m",4.5],["≤5.5m",5.5],["≤6.5m",6.5],["≤8m",8],["Any price",11]];
function applyPlayerFilters(players, sq, f){
  let l=players;
  if(f.pos && f.pos!=="ALL") l=l.filter(p=>p.position===f.pos);
  if(f.grp && f.grp!=="ALL") l=l.filter(p=>sq[p.squadId].group===f.grp);
  if(f.maxP<11) l=l.filter(p=>p.price<=f.maxP);
  if(f.q){ const n=f.q.toLowerCase(); l=l.filter(p=> fullName(p).toLowerCase().includes(n) || sq[p.squadId].name.toLowerCase().includes(n)); }
  const key=SORT_KEY[f.sort]||SORT_KEY.proj;
  return [...l].sort((a,b)=>key(b)-key(a));
}
function PlayerFilters({f, setF, lockPos, showGroup=true}){
  const set=patch=>setF(prev=>({...prev,...patch}));
  return <>
    <div className="searchbar">
      <input placeholder="Search player or country…" value={f.q} onChange={e=>set({q:e.target.value})}/>
      {showGroup && <select value={f.grp} onChange={e=>set({grp:e.target.value})}>
        <option value="ALL">All groups</option>
        {"abcdefghijkl".split("").map(g=><option key={g} value={g}>Group {g.toUpperCase()}</option>)}
      </select>}
    </div>
    <div className="pillrow">
      {!lockPos && ["ALL","GK","DEF","MID","FWD"].map(p=><button key={p} className={"chip"+(f.pos===p?" on":"")} onClick={()=>set({pos:p})}>{p}</button>)}
      {!lockPos && <span style={{width:6}}/>}
      {SORT_OPTS.map(([k,l])=><button key={k} className={"chip"+(f.sort===k?" on":"")} onClick={()=>set({sort:k})}>{l}</button>)}
    </div>
    <div className="pillrow" style={{paddingTop:0}}>
      {PRICE_OPTS.map(([l,v])=><button key={l} className={"chip"+(f.maxP===v?" on":"")} onClick={()=>set({maxP:v})}>{l}</button>)}
    </div>
  </>;
}

/* ---------------- players browser ---------------- */
// right-column metric to surface for the active sort (so the value you sorted by is visible)
function sortMetric(p, sort){
  if(sort==="act")  return {v:(p.act!=null?p.act:"—"), l:"PTS"};
  if(sort==="deep") return {v:p.tourn, l:"PTS"};
  if(sort==="xg")   return {v:p.txg.toFixed(1), l:"xG"};
  if(sort==="xgc")  return {v:p.txgc.toFixed(1), l:"xGC"};
  if(sort==="cs")   return {v:Math.round(p.tcs*100)+"%", l:"CS"};
  return null;
}
function PlayersView({players, sq, toggle, myIds, openP, fixtures}) {
  const [f,setF]=useState({q:"",pos:"ALL",grp:"ALL",maxP:11,sort:"proj"});
  const [cnt,setCnt]=useState(60);
  const list = useMemo(()=>applyPlayerFilters(players,sq,f),[players,sq,f]);
  return <>
    <div className="sticky2">
      <PlayerFilters f={f} setF={setF}/>
    </div>
    <div className="card" style={{padding:0}}>
      {list.slice(0,cnt).map(p=>{ const m=sortMetric(p,f.sort); return <PlayerRow key={p.id} p={p} sq={sq} onAdd={toggle} inTeam={myIds.includes(p.id)} onOpen={openP}
        points={m?m.v:null} pointsLabel={m?m.l:null} fixtures={fixtures}/>; })}
    </div>
    {cnt<list.length && <div style={{textAlign:"center",margin:"4px 0 14px"}}>
      <button className="btn ghost" onClick={()=>setCnt(c=>c+60)}>Show more ({list.length-cnt} left)</button></div>}
  </>;
}

/* ---------------- player detail ---------------- */
function Detail({p, sq, fixtures, close, toggle, inTeam}) {
  const t=sq[p.squadId]; const fx=fixtures[t.id]||[]; const nd=nextFixtureDate(p.squadId,fixtures);
  return <div style={{position:"fixed",inset:0,zIndex:60,background:"rgba(5,8,12,.72)"}} onClick={close}>
    <div className="card" style={{position:"absolute",left:0,right:0,bottom:0,margin:0,borderRadius:"18px 18px 0 0",maxHeight:"82vh",overflow:"auto",padding:"16px"}} onClick={e=>e.stopPropagation()}>
      <div className="row">
        <span style={{fontSize:30}}>{FLAGS[t.abbr]}</span>
        <div style={{flex:1}}>
          <div className="disp" style={{fontSize:20,fontWeight:700}}>{fullName(p)} <SpBadges sp={p.sp}/></div>
          <div className="pmeta num" style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>{p.position} · {t.name} · Group {t.group.toUpperCase()} <ConfidenceTag c={p.confidence}/></div>
        </div>
        <button className="btn ghost" onClick={close}>✕</button>
      </div>
      <div className="row" style={{marginTop:14,gap:8}}>
        {[["$"+p.price+"m","Price"],[p.proj,"Proj (3 GMs)"],[p.tourn,"Deep-run"],[startTier(p.start).label,"Start XI"],[p.percentSelected+"%","Owned"]].map(([v,l])=>
          <div key={l} style={{flex:1,background:"var(--panel2)",borderRadius:10,padding:"9px 4px",textAlign:"center"}}>
            <div className="bigpt num" style={{fontSize:17}}>{v}</div><div style={{fontSize:9.5,color:"var(--dim)"}}>{l}</div></div>)}
      </div>
      <div className="row" style={{marginTop:10,gap:8,alignItems:"center"}}>
        <span className="gl">NEXT</span>
        {nd && <b className="num" style={{color:"var(--pitch)"}}>{nd}</b>}
        <FixtureDots squadId={p.squadId} fixtures={fixtures} sq={sq}/>
        <span className="pmeta">fixture difficulty (Elo)</span>
      </div>
      {p.note&&<div className="note" style={{marginTop:8,fontSize:13}}>⚠ {p.note}</div>}
      {(p.act!=null || p.matchesPlayed>0) && (
        <div className="stbox">
          <div className="row" style={{justifyContent:"space-between"}}>
            <div className="gl">TOURNAMENT SO FAR</div>
            {p.startAuto && <span className="conf exp" title="Start tier auto-derived from actual match participation">auto from results</span>}
          </div>
          <div className="stgrid">
            <div className="cell"><div className="v" style={{color:"var(--pitch)"}}>{p.act!=null?p.act:"—"}</div><div className="l">Actual pts</div></div>
            <div className="cell"><div className="v">{p.goals}</div><div className="l">Goals</div></div>
            <div className="cell"><div className="v">{p.assists}</div><div className="l">Assists</div></div>
            <div className="cell"><div className="v">{p.minutes!=null?p.minutes:"—"}</div><div className="l">Minutes</div></div>
            <div className="cell"><div className="v">{(p.position==="GK"||p.position==="DEF")?p.teamCS:"—"}</div><div className="l">Clean sheets</div></div>
            <div className="cell"><div className="v">{p.actExpected!=null?p.actExpected:"—"}</div><div className="l">Projected</div></div>
          </div>
          {p.actExpected!=null && <div className="pmeta" style={{marginTop:8,lineHeight:1.4}}>
            {p.actTone==="up"? <><b style={{color:"#15803d"}}>▲ Outperforming</b> its projection</>
             : p.actTone==="down"? <><b style={{color:"#cf3a3f"}}>▼ Underperforming</b> vs projection</>
             : <>Tracking close to projection</>} — {p.act} actual vs {p.actExpected} projected over {p.matchesPlayed} {p.matchesPlayed===1?"match":"matches"}.
          </div>}
          {p.minutes==null && <div className="pmeta" style={{marginTop:6,opacity:.85,lineHeight:1.4}}>Per-player minutes aren't in the public feed, so clean sheets shown are the team's. Start tier auto-updates from match points instead.</div>}
        </div>
      )}
      <div style={{marginTop:12,background:"var(--panel2)",borderRadius:12,padding:"10px 12px"}}>
        <div className="gl" style={{marginBottom:7}}>PROJECTION BASIS</div>
        <div className="row" style={{justifyContent:"space-between",padding:"3px 0"}}><span className="pmeta">Team strength</span><span className="num" style={{fontSize:13,fontWeight:600}}>Elo {t.elo} · {PROG_LABEL[t.prog]}</span></div>
        <div style={{padding:"5px 0 2px"}}>
          <span className="pmeta">Team goals / game</span>
          <div className="mchip-row" style={{marginTop:6}}>
            <StatChip tone={xgTone(p.txg)} icon="⚽" title="Team's projected goals scored per group game (xG)">{p.txg.toFixed(1)} xG</StatChip>
            <StatChip tone={xgcTone(p.txgc)} icon="🥅" title="Team's projected goals conceded per group game (xGC), lower is better">{p.txgc.toFixed(1)} xGC</StatChip>
            <StatChip tone={csTone(Math.round(p.tcs*100))} icon="🛡️" title="Team's clean-sheet probability per group game">{Math.round(p.tcs*100)}% CS</StatChip>
          </div>
        </div>
        <div className="row" style={{justifyContent:"space-between",padding:"3px 0",alignItems:"center"}}><span className="pmeta">Start tier</span><StartTag v={p.start}/></div>
        <div className="row" style={{justifyContent:"space-between",padding:"3px 0"}}><span className="pmeta">Set pieces</span><span>{p.sp? <SpBadges sp={p.sp}/> : <span className="pmeta">none</span>}</span></div>
        <div className="pmeta" style={{marginTop:6,lineHeight:1.4}}>
          {p.confidence==="expert"
            ? <>Blends an expert projection (<b className="num" style={{color:"var(--pitch)"}}>{p.expert}</b> pts, RotoWire group stage) with the model.</>
            : <>Model estimate only — no expert projection for this player yet.</>}
        </div>
      </div>
      <div style={{marginTop:12}}>
        <div className="gl">FIXTURES</div>
        {fx.map((f,i)=>{ const r=fixtureResult(f); return <div key={i} className="row" style={{padding:"5px 0"}}>
          <span className="fixdot" style={{background:fixColor(f.diff)}}/>
          <span style={{fontSize:14,flex:1}}>{FLAGS[sq[f.opp].abbr]} {sq[f.opp].name}</span>
          {r
            ? <><span className="num" style={{fontSize:14,fontWeight:800}}>{r.g}–{r.a}</span><span className={"resbadge "+r.res[1]}>{r.res[0]}</span></>
            : <span className="pmeta num">{fmtDate(f.date)}</span>}</div>; })}
      </div>
      <button className={"btn "+(inTeam?"r":"g")} style={{width:"100%",marginTop:14}} onClick={()=>{toggle(p);close();}}>
        {inTeam?"Remove from my team":"Add to my team"}</button>
    </div>
  </div>;
}

/* ---------------- pitch view ---------------- */
function PitchToken({p, sq, cap, vc, onClick, fixtures}){
  const badge = p.id===cap? "cap" : p.id===vc? "vc" : null;
  const nd = nextFixtureDate(p.squadId, fixtures);
  return <div className="ptok" onClick={onClick}>
    <span className="ptok-x" aria-hidden="true">⇄</span>
    {badge && <span className={"ptok-cv "+badge}>{badge==="cap"?"C":"V"}</span>}
    <div className="jersey"><span className="crest">{FLAGS[sq[p.squadId].abbr]||"⚽"}</span></div>
    <div className="ptok-card">
      <div className="pn">{pName(p)}</div>
      <div className="pp">${p.price}</div>
      {nd && <div className="png">{nd}</div>}
      <FixtureDots squadId={p.squadId} fixtures={fixtures} sq={sq}/>
    </div>
  </div>;
}
function Pitch({squad, sq, cap, vc, fixtures, onToken, onEmpty}){
  const byPos={GK:[],DEF:[],MID:[],FWD:[]};
  squad.forEach(p=>byPos[p.position].push(p));
  return <div className="pitch">
    <div className="stripes"/>
    <div className="lines"/>
    <div className="pbox top"/>
    <div className="pbox bot"/>
    {[["GK",QUOTA.GK],["DEF",QUOTA.DEF],["MID",QUOTA.MID],["FWD",QUOTA.FWD]].map(([pos,q])=>(
      <div key={pos} className="prow-p">
        {byPos[pos].map(p=><PitchToken key={p.id} p={p} sq={sq} cap={cap} vc={vc} fixtures={fixtures} onClick={onToken&&(()=>onToken(p,pos))}/>)}
        {Array.from({length:Math.max(0,q-byPos[pos].length)}).map((_,i)=>
          <div key={"e"+i} className="ptok empty" onClick={()=>onEmpty&&onEmpty(pos)}>
            <div className="jersey"><span className="crest">+</span></div>
            <div className="ptok-card"><div className="pn">{pos}</div></div>
          </div>)}
      </div>))}
  </div>;
}

/* ---------------- in-place selection sheet (add / replace / remove) ---------------- */
function SelectSheet({slot, mySquad, players, sq, fixtures, close, onPick, onRemove}){
  const {out, position} = slot;
  const [f,setF]=useState({q:"",grp:"ALL",maxP:11,sort:"proj"});
  const baseCost = mySquad.reduce((s,p)=>s+p.price,0) - (out? out.price : 0);  // squad cost with the slot vacated
  const budgetLeft = Math.round((BUDGET-baseCost)*10)/10;                      // most a pick can cost
  const nationCount = sid => mySquad.filter(p=>p.squadId===sid && (!out || p.id!==out.id)).length;
  const list = useMemo(()=>{
    const base = players.filter(c=> !mySquad.some(p=>p.id===c.id));   // not already picked
    return applyPlayerFilters(base, sq, {...f, pos:position});        // position locked + user sort/filter
  },[players,mySquad,sq,f,position]);
  const t = out? sq[out.squadId] : null;
  return <div style={{position:"fixed",inset:0,zIndex:60,background:"rgba(5,8,12,.72)"}} onClick={close}>
    <div className="card" style={{position:"absolute",left:0,right:0,bottom:0,margin:0,borderRadius:"18px 18px 0 0",maxHeight:"88vh",overflow:"auto",padding:16}} onClick={e=>e.stopPropagation()}>
      <div className="row" style={{justifyContent:"space-between"}}>
        <div className="gl">{out? "REPLACE "+position : "ADD "+position} · ${budgetLeft.toFixed(1)}m free</div>
        <button className="btn ghost" style={{padding:"4px 10px"}} onClick={close}>✕</button>
      </div>
      {out && <div className="row" style={{marginTop:8,background:"var(--panel2)",borderRadius:10,padding:"7px 9px"}}>
        <span style={{fontSize:20}}>{FLAGS[t.abbr]||"⚽"}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:14}}>Out: {fullName(out)}</div>
          <div className="pmeta num">{out.position} · {t.abbr} · ${out.price}m · proj {out.proj}</div>
        </div>
        <button className="btn r" style={{fontSize:12,padding:"7px 11px"}} onClick={onRemove}>Remove</button>
      </div>}
      <div className="sticky2" style={{top:0,marginTop:8}}>
        <PlayerFilters f={f} setF={setF} lockPos={true} showGroup={false}/>
      </div>
      <div className="card" style={{padding:0,margin:"6px 0 0"}}>
        {list.slice(0,60).map(c=>{
          const reason = (baseCost+c.price) > BUDGET ? "Over budget" : nationCount(c.squadId) >= NATION_MAX ? "Nation cap" : null;
          return <PlayerRow key={c.id} p={c} sq={sq} fixtures={fixtures}
            onOpen={reason? null : (cand=>onPick(cand))} lockReason={reason}/>;
        })}
        {list.length===0 && <div className="pmeta" style={{padding:12}}>No {position} match your filters. Clear the search or price filter.</div>}
        {list.length>60 && <div className="pmeta" style={{padding:"8px 12px"}}>+{list.length-60} more — refine with the sort or filters above.</div>}
      </div>
    </div>
  </div>;
}

/* ---------------- my team ---------------- */
function MyTeam({squad, sq, toggle, cap, vc, setCapVc, onPick, fixtures}) {
  const [view,setView]=useState("pitch");
  const cost = squad.reduce((s,p)=>s+p.price,0);
  const proj = squad.reduce((s,p)=>s+p.proj*(p.id===cap?2:1),0);
  const byPos = {GK:[],DEF:[],MID:[],FWD:[]};
  squad.forEach(p=>byPos[p.position].push(p));
  const nations={};
  squad.forEach(p=>{nations[p.squadId]=(nations[p.squadId]||0)+1;});
  const warns=[];
  if(squad.some(p=>p.start<0.5)) warns.push("You have rotation/injury risks in the squad — check the ⚠ notes.");
  Object.entries(nations).forEach(([s,c])=>{ if(c>=3) warns.push(`${sq[s].name}: at the 3-per-nation cap.`); });
  return <>
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div><div className="gl">BUDGET</div><div className="bigpt num" style={{color:cost>100?"var(--red)":"var(--ink)"}}>${cost.toFixed(1)}m <span className="fade" style={{fontSize:13}}>/ $100m</span></div></div>
        <div style={{textAlign:"right"}}><div className="gl">PROJ. GROUP PTS</div><div className="bigpt num" style={{color:"var(--pitch)"}}>{Math.round(proj)}</div></div>
      </div>
      <div className="meter" style={{marginTop:8}}><i style={{width:`${Math.min(100,cost)}%`,background:cost>100?"var(--red)":"var(--pitch)"}}/></div>
      <div className="pmeta" style={{marginTop:6}}>{squad.length}/15 picked · captain doubles his points</div>
    </div>
    {warns.map((w,i)=><div key={i} className="card note" style={{fontSize:12.5}}>⚠ {w}</div>)}
    <div className="viewtog">
      {[["pitch","⚽ Pitch"],["list","≣ List"]].map(([k,l])=>
        <button key={k} className={"chip"+(view===k?" on":"")} onClick={()=>setView(k)}>{l}</button>)}
    </div>
    {view==="pitch" && <Pitch squad={squad} sq={sq} cap={cap} vc={vc} fixtures={fixtures} onToken={onPick} onEmpty={pos=>onPick(null,pos)}/>}
    {view==="list" && ["GK","DEF","MID","FWD"].map(pos=>(
      <div key={pos} className="card">
        <div className="gl" style={{marginBottom:7}}>{pos} · {byPos[pos].length}/{QUOTA[pos]}</div>
        {byPos[pos].map(p=>(
          <div key={p.id} className="slot full">
            <div className="row" style={{flex:1,minWidth:0,gap:8,cursor:"pointer"}} onClick={()=>onPick(p,p.position)}>
              <span style={{fontSize:17}}>{FLAGS[sq[p.squadId].abbr]}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:600}}>{fullName(p)} {p.id===cap&&<span className="cap">C</span>} {p.id===vc&&<span className="vc">VC</span>}</div>
                <div className="pmeta num" style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><span>${p.price}m · proj {p.proj}</span> <StartTag v={p.start}/> <span>⇄ tap to change</span></div>
              </div>
            </div>
            <button className="chip" onClick={()=>setCapVc(p.id, vc===p.id?null:vc)}>C</button>
            <button className="chip" onClick={()=>setCapVc(cap===p.id?null:cap, p.id)}>VC</button>
            <button className="btn r" style={{padding:"5px 9px",fontSize:12}} onClick={()=>toggle(p)}>✕</button>
          </div>))}
        {Array.from({length:QUOTA[pos]-byPos[pos].length}).map((_,i)=>
          <div key={i} className="slot" onClick={()=>onPick(null,pos)} style={{cursor:"pointer",color:"var(--dim)",fontSize:13}}>+ Add a {pos}</div>)}
      </div>))}
    {squad.length===15 && <div style={{textAlign:"center",padding:"2px 0 6px"}}>
      <a className="coffee" href="https://buymeacoffee.com/sma6871" target="_blank" rel="noopener noreferrer">Enjoying it? ☕ Buy me a coffee</a>
    </div>}
  </>;
}

/* ---------------- AI coach ---------------- */
function buildContext(players, sq, mySquad, cap) {
  const byTeam={};
  players.forEach(p=>{(byTeam[p.squadId]=byTeam[p.squadId]||[]).push(p);});
  let lines=[];
  Object.values(sq).sort((a,b)=>a.group.localeCompare(b.group)||b.elo-a.elo).forEach(t=>{
    const tops=byTeam[t.id].sort((a,b)=>b.proj-a.proj)
      .map(p=>`#${p.id} ${fullName(p)} ${p.position} $${p.price} proj${p.proj} XI${(p.start*100)|0}%${p.sp?" SP:"+p.sp:""}${p.scout?" DIFF":""}${p.note?" ["+p.note+"]":""}`).join("; ");
    lines.push(`${t.name} (Grp ${t.group.toUpperCase()}, Elo ${t.elo}, ${t.prog}): ${tops}`);
  });
  const mine = mySquad.length? mySquad.map(p=>`#${p.id} ${fullName(p)}(${p.position},$${p.price},${sq[p.squadId].abbr}${p.id===cap?",CAPTAIN":""})`).join(", ") : "none picked yet";
  return `You are an expert FIFA World Cup Fantasy 2026 coach inside a fantasy planning app. Be concise, decisive and practical; use the data below.
RULES: $100m budget, 15 players (2GK/5DEF/5MID/3FWD), max 3 per nation in groups, captain doubles points, prices fixed.
OFFICIAL SCORING: goals GK 9 / DEF 7 / MID 6 / FWD 5 (+1 if direct free kick); assist 3; winning a pen +2; CS (60+min) GK/DEF 5, MID 1; 1st goal conceded free, each extra -1 (GK/DEF); GK 1pt/3 saves, pen save +3; MID 1pt/3 tackles & 1pt/2 chances created; FWD 1pt/2 shots on target; yellow -1, red -2, OG -2; SCOUTING BONUS: +2 when a player in <5% of teams scores >4 pts in a match (marked DIFF below).
DATA KEY: #id = player id; proj = projected points across 3 group games (scouting bonus included); XI% = starting probability; SP = set pieces (P pens, C corners, F free kicks).
DRAFT MODE: If the user asks you to build/draft/suggest a full squad, FIRST give a 2-3 sentence rationale, THEN output the squad as a fenced code block starting with \u0060\u0060\u0060draft containing ONLY JSON: {"ids":[15 player ids],"cap":id,"vc":id}. Use exact #ids from the data. Respect 2GK/5DEF/5MID/3FWD, $100m total, max 3 per nation. The app renders it as a draft the user can review and apply — you can NEVER save it yourself; the user decides.
${NOTABLE_ABSENCES}
TEAM-BY-TEAM DATA (top players):
${lines.join("\n")}
USER'S CURRENT SQUAD: ${mine}`;
}

function DraftCard({draft, players, sq, onApply}) {
  const ps = (draft.ids||[]).map(id=>players.find(p=>p.id===id)).filter(Boolean);
  const cost = ps.reduce((s,p)=>s+p.price,0);
  const counts = {GK:0,DEF:0,MID:0,FWD:0}; ps.forEach(p=>counts[p.position]++);
  const nation = {}; ps.forEach(p=>{nation[p.squadId]=(nation[p.squadId]||0)+1;});
  const errs = [];
  if(ps.length!==15) errs.push(`${ps.length}/15 valid players`);
  Object.entries(QUOTA).forEach(([pos,q])=>{ if(counts[pos]!==q) errs.push(`${counts[pos]}/${q} ${pos}`); });
  if(cost>BUDGET) errs.push(`$${cost.toFixed(1)}m > $100m`);
  Object.entries(nation).forEach(([sid,c])=>{ if(c>NATION_MAX) errs.push(`${c}× ${sq[sid]?.abbr} (max 3)`); });
  const capP = players.find(p=>p.id===draft.cap);
  const order = {GK:0,DEF:1,MID:2,FWD:3};
  return <div className="draftcard">
    <div className="gl" style={{color:"var(--pitch)",marginBottom:6}}>AI DRAFT · ${cost.toFixed(1)}m · {ps.length} players</div>
    {["GK","DEF","MID","FWD"].map(pos=>
      <div key={pos} style={{fontSize:12.5,lineHeight:1.6}}><b style={{color:"var(--dim)",fontSize:10.5}}>{pos}</b>{" "}
        {ps.filter(p=>p.position===pos).map(p=>`${fullName(p)}${p.id===draft.cap?" Ⓒ":p.id===draft.vc?" ⓥ":""} $${p.price}`).join(" · ")}</div>)}
    {errs.length>0
      ? <div className="note" style={{marginTop:6}}>⚠ Invalid draft: {errs.join(", ")} — ask the coach to fix it.</div>
      : <button className="btn g" style={{marginTop:9,width:"100%"}} onClick={()=>onApply(ps.map(p=>p.id), draft.cap||null, draft.vc||null)}>
          Apply to My Team{capP?` (C: ${fullName(capP)})`:""}</button>}
  </div>;
}

function mdInline(text, keyPrefix){
  // **bold**, *italic*, `code`, and bullet markers -> React nodes (newlines kept via pre-wrap)
  const nodes=[]; let buf=text; let k=0;
  const re=/(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\n]+)\*)/g;
  let last=0, mm;
  while((mm=re.exec(buf))){
    if(mm.index>last) nodes.push(buf.slice(last,mm.index));
    if(mm[2]!=null) nodes.push(<b key={keyPrefix+"b"+(k++)}>{mm[2]}</b>);
    else if(mm[3]!=null) nodes.push(<code key={keyPrefix+"c"+(k++)} style={{background:"var(--panel2)",padding:"1px 5px",borderRadius:5,fontSize:12.5}}>{mm[3]}</code>);
    else if(mm[4]!=null) nodes.push(<i key={keyPrefix+"i"+(k++)}>{mm[4]}</i>);
    last=mm.index+mm[0].length;
  }
  if(last<buf.length) nodes.push(buf.slice(last));
  return nodes;
}
function MdText({text}){
  // render line-by-line so leading "- "/"* " become real bullets
  const lines=text.split("\n");
  return <span>{lines.map((ln,i)=>{
    const bullet=/^\s*[-*]\s+/.test(ln);
    const content=bullet? ln.replace(/^\s*[-*]\s+/,"") : ln;
    return <span key={i} style={bullet?{display:"block",paddingLeft:14,textIndent:-14}:{display:"block"}}>
      {bullet?"• ":""}{mdInline(content,i+"-")}
    </span>;
  })}</span>;
}
function CoachMsg({m, players, sq, onApply}) {
  if(m.role==="user") return <div className="msg u">{m.content}</div>;
  const parts = m.content.split(/```draft([\s\S]*?)```/g);
  return <div className="msg a">{parts.map((part,i)=>{
    if(i%2===0) return part.trim()? <span key={i}><MdText text={part.trim()}/></span> : null;
    try{ const d=JSON.parse(part.trim()); return <DraftCard key={i} draft={d} players={players} sq={sq} onApply={onApply}/>; }
    catch(e){ return <span key={i} className="fade">{part}</span>; }
  })}</div>;
}

const GREETING = {role:"assistant",content:"I'm your World Cup fantasy coach — I can see all 48 teams, projections, starting-XI odds, set-piece takers and your current squad. Ask me anything, or say \"draft me a squad\" and I'll propose a full 15 you can review and apply (only you can save it)."};

function CoachWaitlist(){
  return <div className="card" style={{marginTop:18,textAlign:"center"}}>
    <div style={{fontSize:40,marginBottom:6}}>⚽</div>
    <div className="disp" style={{fontSize:20,fontWeight:800,marginBottom:6}}>AI Coach is in beta</div>
    <div style={{fontSize:14,lineHeight:1.5,color:"var(--dim)",marginBottom:14}}>
      A chat coach that reads every team's projections, starting-XI odds and set-piece takers — and can draft a full squad you approve. Launching during the group stage.</div>
    <a className="btn g" style={{textDecoration:"none",display:"inline-block"}} href={WAITLIST_URL} target="_blank" rel="noopener">Join the waitlist</a>
  </div>;
}
function Coach({players, sq, mySquad, cap, msgs, setMsgs, onApply}) {
  const [inp,setInp]=useState("");
  const [busy,setBusy]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ ref.current?.scrollTo(0,99999); },[msgs,busy]);
  const ask=async()=>{
    const text=inp.trim(); if(!text||busy) return;
    const hist=[...msgs,{role:"user",content:text}];
    setMsgs(hist); setInp(""); setBusy(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:buildContext(players,sq,mySquad,cap),
          messages:hist.slice(-10).map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json();
      const out=(d.content||[]).filter(c=>c.type==="text").map(c=>c.text).join("\n")||"Hmm, empty reply — try again.";
      setMsgs(m=>[...m,{role:"assistant",content:out}]);
    }catch(e){ setMsgs(m=>[...m,{role:"assistant",content:"Connection hiccup — try that again."}]); }
    setBusy(false);
  };
  return <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 175px)"}}>
    <div ref={ref} style={{flex:1,overflow:"auto",padding:"0 12px",display:"flex",flexDirection:"column",gap:8}}>
      {msgs.map((m,i)=><CoachMsg key={i} m={m} players={players} sq={sq} onApply={onApply}/>)}
      {busy&&<div className="msg a"><span className="spin"/></div>}
    </div>
    <div className="searchbar" style={{paddingTop:8}}>
      <input placeholder='e.g. "Draft me a squad" or "Best MD1 captain?"' value={inp} onChange={e=>setInp(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&ask()}/>
      <button className="btn g" onClick={ask} disabled={busy}>Ask</button>
    </div>
  </div>;
}

/* ---------------- rules ---------------- */
function Rules() {
  return <>
    <div className="card">
      <div className="gl" style={{marginBottom:8}}>OFFICIAL SCORING — play.fifa.com</div>
      <table className="sc"><thead><tr><th></th><th>GK</th><th>DEF</th><th>MID</th><th>FWD</th></tr></thead>
        <tbody>{SCORING.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} className="num">{c}</td>)}</tr>)}</tbody></table>
    </div>
    <div className="card">
      <div className="gl" style={{marginBottom:5}}>ABOUT THE PROJECTIONS</div>
      <div style={{fontSize:13.5,lineHeight:1.5,color:"var(--ink)",opacity:.85}}>
        Projected points are <b>pre-tournament estimates</b> from team Elo, starting-XI probability, set-piece duty and expert group-stage values — not official numbers. Expect them to <b>recalibrate after Matchday 1</b>, once real lineups and results land. Players marked <span className="conf exp">expert-backed</span> blend an expert (RotoWire) projection; <span className="conf mod">model estimate</span> players are model-only.
      </div>
    </div>
    {RULES_TEXT.map(([t,b],i)=><div key={i} className="card"><div className="gl" style={{marginBottom:5}}>{t.toUpperCase()}</div>
      <div style={{fontSize:13.5,lineHeight:1.5,color:"var(--ink)",opacity:.85}}>{b}</div></div>)}
    <div className="card"><div className="gl" style={{marginBottom:5}}>NOTABLE ABSENCES & FITNESS WATCH</div>
      <div style={{fontSize:13,lineHeight:1.55,color:"var(--amber)"}}>{NOTABLE_ABSENCES}</div></div>
    <div className="card pmeta" style={{lineHeight:1.5}}>
      Data: official play.fifa.com fantasy feeds (prices, ownership, live points — refresh anytime), World Football Elo Ratings, expert group-stage projections (RotoWire, June 9) and curated lineup/fitness research. Projections are estimates — lineups drop ~1h before kick-off.</div>
    <div style={{textAlign:"center",padding:"2px 0 8px"}}>
      <a className="coffee" href="https://buymeacoffee.com/sma6871" target="_blank" rel="noopener noreferrer">Buy me a coffee ☕</a>
    </div>
  </>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
