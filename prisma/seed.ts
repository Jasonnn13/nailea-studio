import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Mulai seeding database...");

  // Hapus data lama (urutan penting karena foreign key)
  await prisma.detailTransaksiJasa.deleteMany();
  await prisma.detailTransaksiItem.deleteMany();
  await prisma.transaksiJasa.deleteMany();
  await prisma.transaksiItem.deleteMany();
  await prisma.jasa.deleteMany();
  await prisma.item.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Data lama dihapus");

  // Buat Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        nama: "Admin Utama",
        email: "admin@nailsalon.com",
        password: "admin123",
        role: "admin",
        aktif: true,
      },
    }),
    prisma.user.create({
      data: {
        nama: "Siti Nurhaliza",
        email: "siti@nailsalon.com",
        password: "staff123",
        role: "staff",
        aktif: true,
      },
    }),
    prisma.user.create({
      data: {
        nama: "Dewi Lestari",
        email: "dewi@nailsalon.com",
        password: "staff123",
        role: "staff",
        aktif: true,
      },
    }),
  ]);
  console.log(`✅ ${users.length} users dibuat`);

  // Buat Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        nama: "Rina Kartika",
        email: "rina@email.com",
        telepon: "081234567890",
        tanggalLahir: new Date("1995-03-15"),
      },
    }),
    prisma.customer.create({
      data: {
        nama: "Maya Sari",
        email: "maya@email.com",
        telepon: "081234567891",
        tanggalLahir: new Date("1990-07-22"),
      },
    }),
    prisma.customer.create({
      data: {
        nama: "Putri Ayu",
        email: "putri@email.com",
        telepon: "081234567892",
        tanggalLahir: new Date("1988-11-08"),
      },
    }),
    prisma.customer.create({
      data: {
        nama: "Linda Permata",
        email: "linda@email.com",
        telepon: "081234567893",
        tanggalLahir: new Date("1992-05-30"),
      },
    }),
    prisma.customer.create({
      data: {
        nama: "Anita Wulandari",
        email: "anita@email.com",
        telepon: "081234567894",
        tanggalLahir: new Date("1997-01-12"),
      },
    }),
  ]);
  console.log(`✅ ${customers.length} customers dibuat`);

  // Buat Items (Barang)
  const items = await Promise.all([
    prisma.item.create({
      data: {
        nama: "Kutek OPI Red",
        stok: 50,
        deskripsi: "Kutek warna merah merk OPI",
        harga: 150000,
        kategori: "Kutek",
        aktif: true,
      },
    }),
    prisma.item.create({
      data: {
        nama: "Kutek OPI Pink",
        stok: 45,
        deskripsi: "Kutek warna pink merk OPI",
        harga: 150000,
        kategori: "Kutek",
        aktif: true,
      },
    }),
    prisma.item.create({
      data: {
        nama: "Nail Art Sticker Bunga",
        stok: 100,
        deskripsi: "Stiker nail art motif bunga",
        harga: 25000,
        kategori: "Aksesoris",
        aktif: true,
      },
    }),
    prisma.item.create({
      data: {
        nama: "Nail Remover 100ml",
        stok: 30,
        deskripsi: "Pembersih kutek 100ml",
        harga: 35000,
        kategori: "Perawatan",
        aktif: true,
      },
    }),
    prisma.item.create({
      data: {
        nama: "Hand Cream Lavender",
        stok: 25,
        deskripsi: "Krim tangan aroma lavender",
        harga: 75000,
        kategori: "Perawatan",
        aktif: true,
      },
    }),
    prisma.item.create({
      data: {
        nama: "Cuticle Oil",
        stok: 40,
        deskripsi: "Minyak perawatan kutikula",
        harga: 55000,
        kategori: "Perawatan",
        aktif: true,
      },
    }),
  ]);
  console.log(`✅ ${items.length} items dibuat`);

  // Buat Jasa (Layanan)
  const jasaList = await Promise.all([
    prisma.jasa.create({
      data: {
        nama: "Manicure Basic",
        deskripsi: "Perawatan kuku tangan dasar termasuk potong, bentuk, dan poles",
        harga: 75000,
        durasi: 30,
        kategori: "Manicure",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Manicure Gel",
        deskripsi: "Manicure dengan kutek gel tahan lama",
        harga: 150000,
        durasi: 45,
        kategori: "Manicure",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Pedicure Basic",
        deskripsi: "Perawatan kuku kaki dasar termasuk rendam, potong, dan poles",
        harga: 100000,
        durasi: 45,
        kategori: "Pedicure",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Pedicure Spa",
        deskripsi: "Pedicure lengkap dengan scrub dan masker kaki",
        harga: 175000,
        durasi: 60,
        kategori: "Pedicure",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Nail Art Simple",
        deskripsi: "Nail art sederhana 2-3 motif per kuku",
        harga: 50000,
        durasi: 30,
        kategori: "Nail Art",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Nail Art Premium",
        deskripsi: "Nail art kompleks dengan berbagai teknik",
        harga: 150000,
        durasi: 60,
        kategori: "Nail Art",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Nail Extension Acrylic",
        deskripsi: "Perpanjangan kuku dengan acrylic",
        harga: 300000,
        durasi: 90,
        kategori: "Extension",
        aktif: true,
      },
    }),
    prisma.jasa.create({
      data: {
        nama: "Nail Extension Gel",
        deskripsi: "Perpanjangan kuku dengan gel",
        harga: 350000,
        durasi: 90,
        kategori: "Extension",
        aktif: true,
      },
    }),
  ]);
  console.log(`✅ ${jasaList.length} jasa dibuat`);

  // Buat Transaksi Item (Penjualan Barang)
  const transaksiItem1 = await prisma.transaksiItem.create({
    data: {
      customerId: customers[0].id,
      userId: users[1].id,
      tanggal: new Date("2026-01-20"),
      total: 325000,
      status: "SELESAI",
      catatan: "Pembelian kutek dan hand cream",
      detail: {
        create: [
          { itemId: items[0].id, jumlah: 1, harga: 150000 },
          { itemId: items[2].id, jumlah: 2, harga: 25000 },
          { itemId: items[4].id, jumlah: 1, harga: 75000 },
        ],
      },
    },
  });

  const transaksiItem2 = await prisma.transaksiItem.create({
    data: {
      customerId: customers[1].id,
      userId: users[2].id,
      tanggal: new Date("2026-01-22"),
      total: 185000,
      status: "SELESAI",
      catatan: null,
      detail: {
        create: [
          { itemId: items[1].id, jumlah: 1, harga: 150000 },
          { itemId: items[3].id, jumlah: 1, harga: 35000 },
        ],
      },
    },
  });

  const transaksiItem3 = await prisma.transaksiItem.create({
    data: {
      customerId: customers[2].id,
      userId: users[1].id,
      tanggal: new Date("2026-01-25"),
      total: 110000,
      status: "PENDING",
      catatan: "Menunggu stok cuticle oil",
      detail: {
        create: [
          { itemId: items[5].id, jumlah: 2, harga: 55000 },
        ],
      },
    },
  });

  console.log("✅ 3 transaksi item dibuat");

  // Buat Transaksi Jasa (Penjualan Layanan)
  const transaksiJasa1 = await prisma.transaksiJasa.create({
    data: {
      customerId: customers[0].id,
      userId: users[1].id,
      tanggal: new Date("2026-01-20"),
      total: 225000,
      status: "SELESAI",
      catatan: "Paket manicure + nail art",
      detail: {
        create: [
          { jasaId: jasaList[1].id, jumlah: 1, harga: 150000 },
          { jasaId: jasaList[4].id, jumlah: 1, harga: 50000 },
        ],
      },
    },
  });

  const transaksiJasa2 = await prisma.transaksiJasa.create({
    data: {
      customerId: customers[1].id,
      userId: users[2].id,
      tanggal: new Date("2026-01-21"),
      total: 275000,
      status: "SELESAI",
      catatan: null,
      detail: {
        create: [
          { jasaId: jasaList[2].id, jumlah: 1, harga: 100000 },
          { jasaId: jasaList[3].id, jumlah: 1, harga: 175000 },
        ],
      },
    },
  });

  const transaksiJasa3 = await prisma.transaksiJasa.create({
    data: {
      customerId: customers[3].id,
      userId: users[1].id,
      tanggal: new Date("2026-01-24"),
      total: 500000,
      status: "SELESAI",
      catatan: "Extension full set + nail art",
      detail: {
        create: [
          { jasaId: jasaList[6].id, jumlah: 1, harga: 300000 },
          { jasaId: jasaList[5].id, jumlah: 1, harga: 150000 },
        ],
      },
    },
  });

  const transaksiJasa4 = await prisma.transaksiJasa.create({
    data: {
      customerId: customers[4].id,
      userId: users[2].id,
      tanggal: new Date("2026-01-27"),
      total: 75000,
      status: "PENDING",
      catatan: "Appointment hari ini jam 14:00",
      detail: {
        create: [
          { jasaId: jasaList[0].id, jumlah: 1, harga: 75000 },
        ],
      },
    },
  });

  console.log("✅ 4 transaksi jasa dibuat");

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
