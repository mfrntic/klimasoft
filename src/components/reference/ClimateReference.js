import style from "./ClimateReference.module.css";

function ClimateReference() {
    return <div className={style.climateReference}>
        <div>
            <h2>Klimatska referenca</h2>
            <p>U ovom poglavlju možete naći sve klimatske formule i skale koje se upotrebljavaju u programu, zajedno sa svim pratećim legendama i objašnjenjima.</p>

            <h3>Klimadijagram po Walteru</h3>
            <p>Klimatski dijagram (klimadijagram) po smislu Waltera se vrlo često koristi u bioklimatologiji za prikaz klime određenog područja. Razlog tome je što klimatski dijagram po Walteru daje odličan slikovni uvid u vodni balans nekog ekosustava radi preglednog prikaza odnosa temperature u vode.</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/kd_legend.png" />
            </p>

            <p>Klimadijagrami po Walteru se konstruiraju tako da se oborine nanose na primarnu os y (primarnu ordinatu), a temperature na sekundarnu os y (sekundarnu ordinatu). Vrijednost temperature i oborina nanosi u mjerilu 1:2, tj. za vrijednost temperature od 10°C na ordinati odgovara količina oborina od 20 mm, sve do količine oborina od 100 mm. Oborine iznad 100 mm unose se u mjerilu 1:10, a na dijagramu su obilježene crno i predstavljaju humidno razdoblje. Ukoliko krivulja oborina pada ispod krivulje temperature na dijagramu se to tumači kao sušno ili aridno razdoblje (na dijagramu označeno crveno). Ukoliko se na dijagramu pojavi sušno razdoblje, također se unosi i linija oborina još jednom, ali u mjerilu 1:3 i predstavlja razdoblje suhoće (na dijagramu označeno žuto). Razdoblje suhoće iscrtava se crtkano i daje dobar uvid u mjesece koji su nepovoljni zbog nestašice vode.</p>
            <p>Klimasoft crta klimadijagram automatski prema upisanim podacima za zadano razdoblje, međutim moguće je podesiti i dodatne opcije prikaza odabirom na gumb za dodatne opcije kao i kod svih ostalih analiza (tri vertikalne točkice pokraj svake klimatske formuele za odabir na ekranu izračuna).</p>
            <p>Mogućnosti prikaza klimadijagrama obuhvaćaju prikaz vegetacijskog razdoblja na dijagramu (vegetacijsko razdoblje automatski se iscrtava na dijagramu za sve uzastopne mjesece sa srednjom temperaturom &gt; 6°C), prikaz razdoblja suhoće, te prikaze oznaka dijagrama, crta osi, kardinalnih temperatura i sl.</p>
            <h3>Klimatogram po Walteru</h3>
            <p>Klimatogram po Walteru je prikaz određenog razdoblja kao niz godišnjih klimadijagrama. Dakle vrlo je slično klimadijagramu, osim što se dobiva puno detaljniji uvid u klimu nekog područja, odnosno bazira se na godišnjim vrijednostima. Na taj način puno je lakše uočiti, npr sušne godine.</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/kg-screen.jpg" />
            </p>

            <h3>Langov kišni faktor</h3>
            <p>Godine 1915. R. Lang postavio je svoj poznati kišni faktor</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/FormuleLang.gif" />
            </p>
            <p>Pg je srednja god. Količina padalina, a Tm &gt; 0 je suma pozitivnih poprečnih temperatura podjeljena sa 12.</p>
            <p>Lang prema svojem kišnom faktoru dijeli klimu prema humidnosti po slijedećoj tabeli:</p>
            <table class="table table-bordered table-striped text-center">
                <thead>
                    <tr>
                        <th class="text-center">Langov kišni faktor (LKf)</th>
                        <th class="text-center">Humidnost/aridnost klime</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>&lt; 40</td>
                        <td>Aridno</td>
                    </tr>
                    <tr>
                        <td>41 - 60</td>
                        <td>Semiaridno</td>
                    </tr>
                    <tr>
                        <td>61 - 80</td>
                        <td>Semihumidno</td>
                    </tr>
                    <tr>
                        <td>81 - 160</td>
                        <td>Humidno</td>
                    </tr>
                    <tr>
                        <td>160 &gt;</td>
                        <td>Perhumidno</td>
                    </tr>
                </tbody>
            </table>
            <h3>Mjesečni kišni faktor po Gračaninu</h3>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/FormuleGracanin.gif" />
            </p>
            <p>Formula za mjesečni kišni faktor (Pm srednja mjesečna količina padalina, a Tm je srednja mjesečna temp.)</p>
            <p>Gračanin je podijelio klimu prema vrijednostima svog mjesečnog kišnog faktora:</p>
            <table class="table table-bordered  table-striped text-center">
                <thead>
                    <tr>
                        <th class="text-center">Mjesečni kišni faktor (LKm)</th>
                        <th class="text-center">Humidnost/aridnost klime</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>&lt; 3,3</td>
                        <td>Aridno</td>
                    </tr>
                    <tr>
                        <td>3,3 - 5,0</td>
                        <td>Semiaridno</td>
                    </tr>
                    <tr>
                        <td>5,1 - 6,6</td>
                        <td>Semihumidno</td>
                    </tr>
                    <tr>
                        <td>6,7 - 13,3</td>
                        <td>Humidno</td>
                    </tr>
                    <tr>
                        <td>13,3 &gt;</td>
                        <td>Perhumidno</td>
                    </tr>
                </tbody>
            </table>
            <h3>Indeks aridnosti klime prem E. de Martonneu</h3>
            <p>Indeks aridnosti (suše) kojeg je postavio E. de Martonne 1926 godine</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/FormuleMartonne.gif" />
            </p>
            <p>Formula za E. de Martonneov indeks aridnosti (Pg je srednja godišnja količina padalina, a Tg srednja godišnja temperatura)</p>
            <h3>Indeks (stupanj) kontinentalnosti klime</h3>
            <p>Indeks kontinentalnosti koristi se za određivanje da li je klima više maritimna ili kontinentalna. Smislio ga je W. Gorczynski, a formulu su poboljšali Conrad i Pollak (1950). Indeks kontinentalnosti daje brojčanu vrijednost između 0 i 100. Indeks k = 0 imaju čiste oceanske klime (npr. tropski otoci), a indeks k = 100 najtvrđe kontinentalne klime (npr. duboka unutrašnjost kontinenta).</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/FormulaKontinent.gif" />
            </p>
            <p>A je godišnja amplituda temperature zraka na geografskoj širini (fi)</p>
            <h3>Toplinski karakter klime (TK) po M. Gračaninu</h3>
            <p>Kako s biološko-ekološkog gledišta nije svejedno da li je uz određenu humidnost klima hladna, umjereno topla ili žarka. M. Gračanin dodaje još i oznake toplinskog karaktera klime, prema godišnjim i mjesečnim srednjacima temperature zraka.</p>
            <table class="table table-bordered  table-striped text-center">
                <thead>
                    <tr>
                        <th class="text-center">Srednja temperatura (°C)</th>
                        <th class="text-center">Toplinski karakter klime (TK)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>&lt; 0,5</td>
                        <td>Nivalno</td>
                    </tr>
                    <tr>
                        <td>0,6 - 4,0</td>
                        <td>Hladno</td>
                    </tr>
                    <tr>
                        <td>4,1 - 8,0</td>
                        <td>Umjereno hladno</td>
                    </tr>
                    <tr>
                        <td>8,1 - 12,0</td>
                        <td>Umjereno toplo</td>
                    </tr>
                    <tr>
                        <td>12,1 - 20,0</td>
                        <td>Toplo</td>
                    </tr>
                    <tr>
                        <td>20,0 &gt;</td>
                        <td>Vruće</td>
                    </tr>
                </tbody>
            </table>
            <h3>Thorntwaitova metoda određivanja potencijalne evapotranspiracije</h3>
            <p>Zasniva se na podacima temperature zraka osvijetljenog dijela dana. Procijena potencijalne evapotranspiracije u mjesečnom intervalu glasi:</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/FormulaPET.gif" />
            </p>
            <p>gdje je:</p>
            <ul>
                <li>PEm – potencijalna evapotranspiracija ili potrebna voda u mm/mjesecu</li>
                <li>Nm – mjesečni faktor prilagođen trajanju dnevnog svjetla</li>
                <li>Tm – srednja mjesečna temperatura zraka °C</li>
                <li>I – godišnji toplinski indeks dobiven zbrajanjem dvanaest mjesečnih vrijednosti toplinskog indeksa (i)</li>
            </ul>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/FormulePEI.gif" />
            </p>
            <p>Dobivena vrijednost potencijalne evapotranspiracije vrijedi za 12 – satno trajanje dnevnog svjetla. Pri određivanju PE za različito trajanje dnevnog svjetla (sva geografska područja) koristi se korekcijski factor (k) određen prema geografskoj širini i mjesecu, pa je konačna formula potencijalne evapotranspiracije:</p>
            <p>
                <img src="https://monachus.blob.core.windows.net/klimasoft/PEK.gif" />
            </p>
            <p>Tabela vrijednosti korekcijskog faktora <em>k</em> ovise o trajanju dana, što ovisi o odabranoj lokaciji. Klimasoft automatski računa dužinu trajanja dana za odavrano vremensko razdoblje.</p>
            <p>
                Vrijednosti potencijalne evapotranspiracije određene Thornthwaiteovom metodom, za razdoblja manja od jednog mjeseca su manje pouzdana, ali se ipak mogu odrediti odgovarajućim preračunavanjem do dnevne vrijednosti.
                Ova metoda prikladnija je za područja sa subhumidnom klimom.
            </p>
        </div>
    </div>
}

export default ClimateReference;