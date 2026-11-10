// ===== Tanggal hari ini =====
const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const sekarang = new Date();
document.getElementById("tanggalHariIni").textContent =
    "Hari ini: " + sekarang.toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

// ===== Jadwal kuliah =====
// Isi nama hari di SETIAP baris. Nama hari yang berulang
// otomatis disembunyikan saat ditampilkan.
const jadwal = [
    { hari: "Senin", jam: "", matkul: "", ruang: "" },
    { hari: "Selasa", jam: "08.30 - 10.30", matkul: "ALGORITMA DAN PEMROGRAMAN", ruang: "R. A5" },
    { hari: "Selasa", jam: "10.30 - 12.30", matkul: "SISTEM INFORMASI MANAJEMEN KOTA CERDAS", ruang: "R. KU3.07.08" },
    { hari: "Selasa", jam: "15.30 - 17.30", matkul: "INTERNALISASI BUDAYA DAN PEMBENTUKAN KARAKTER", ruang: "R. KU3.07.14" },
    { hari: "Rabu",   jam: "06.30 - 09.30", matkul: "MATEMATIKA DISKRIT", ruang: "R. KU3.07.16" },
    { hari: "Rabu",   jam: "10.30 - 13.30", matkul: "PENGANTAR TEKNOLOGI INFORMASI", ruang: "R. KU3.07.13" },
    { hari: "Kamis",  jam: "07.30 - 09.30", matkul: "DESAIN ANTAR MUKA PENGGUNA", ruang: "R. D3" },
    { hari: "Kamis",  jam: "10.30 - 12.30", matkul: "BAHASA INGGRIS", ruang: "R. KU3.07.01" },
    { hari: "Kamis",  jam: "12.30 - 16.30", matkul: "ALGORITMA DAN PEMROGRAMAN", ruang: "R. B4" },
    { hari: "Jumat",  jam: "07.30 - 09.30", matkul: "JARINGAN KOMPUTER", ruang: "R. D1" },
    { hari: "Jumat",  jam: "13.30 - 16.30", matkul: "DESAIN ANTAR MUKA PENGGUNA", ruang: "R. A2" },
    { hari: "Sabtu", jam: "07.30 - 09.30", matkul: "SISTEM INFORMASI MANAJEMEN KOTA CERDAS", ruang: "R. B1" },
    { hari: "Minggu",  jam: "", matkul: "", ruang: "" }
];

const isiJadwal = document.querySelector("#tabelJadwal tbody");
const hariIni = namaHari[sekarang.getDay()];
let hariSebelumnya = "";

jadwal.forEach(function (j) {
    const tr = document.createElement("tr");
    if (j.hari === hariIni) tr.className = "hari-ini";

    const tampilHari = (j.hari === hariSebelumnya) ? "" : j.hari;
    hariSebelumnya = j.hari;

    [tampilHari, j.jam, j.matkul, j.ruang].forEach(function (teks) {
        const td = document.createElement("td");
        td.textContent = teks;
        tr.appendChild(td);
    });

    isiJadwal.appendChild(tr);
});

// ===== Tugas kuliah =====
const dataAwal = [
    { matkul: "Algoritma dan Pemrograman", deskripsi: "Latihan soal perulangan", hari: "Jumat", selesai: false },
    { matkul: "Matematika Diskrit",        deskripsi: "Latihan logika dan himpunan", hari: "Rabu", selesai: false },
    { matkul: "Jaringan Komputer",         deskripsi: "Rangkuman model OSI", hari: "Kamis", selesai: true }
];

function muatTugas() {
    try {
        const tersimpan = localStorage.getItem("tugas");
        if (tersimpan) return JSON.parse(tersimpan);
    } catch (e) {
        // abaikan, pakai data awal
    }
    return dataAwal;
}

function simpanTugas() {
    try {
        localStorage.setItem("tugas", JSON.stringify(tugas));
    } catch (e) {
        // abaikan jika penyimpanan tidak tersedia
    }
}

let tugas = muatTugas();

const daftarTugas = document.getElementById("daftarTugas");
const ringkasan = document.getElementById("ringkasan");

function tampilkanTugas() {
    daftarTugas.innerHTML = "";

    if (tugas.length === 0) {
        const kosong = document.createElement("li");
        kosong.className = "kosong";
        kosong.textContent = "Belum ada tugas. Tambahkan lewat form di atas.";
        daftarTugas.appendChild(kosong);
    }

    tugas.forEach(function (t, i) {
        const li = document.createElement("li");
        if (t.selesai) li.className = "selesai";

        const cek = document.createElement("input");
        cek.type = "checkbox";
        cek.checked = t.selesai;
        cek.addEventListener("change", function () {
            t.selesai = !t.selesai;
            tampilkanTugas();
        });

        const isi = document.createElement("div");
        isi.className = "isi";

        const strong = document.createElement("strong");
        strong.textContent = t.matkul;

        const spanHari = document.createElement("span");
        spanHari.className = "hari";
        spanHari.textContent = " (" + t.hari + ")";

        isi.append(strong, document.createElement("br"), t.deskripsi, spanHari);

        const tombolHapus = document.createElement("button");
        tombolHapus.className = "hapus";
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", function () {
            tugas.splice(i, 1);
            tampilkanTugas();
        });

        li.append(cek, isi, tombolHapus);
        daftarTugas.appendChild(li);
    });

    const selesai = tugas.filter(function (t) { return t.selesai; }).length;
    ringkasan.textContent = selesai + " dari " + tugas.length + " tugas selesai";

    simpanTugas();
}

document.getElementById("formTugas").addEventListener("submit", function (e) {
    e.preventDefault();
    tugas.push({
        matkul: document.getElementById("inputMatkul").value,
        deskripsi: document.getElementById("inputTugas").value,
        hari: document.getElementById("inputHari").value,
        selesai: false
    });
    this.reset();
    tampilkanTugas();
});

tampilkanTugas();