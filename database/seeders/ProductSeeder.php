<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $p1 = \App\Models\Project::create([
            'name' => 'Main Warehouse (PP)',
            'description' => 'Primary storage facility for industrial equipment in Phnom Penh',
            'address' => 'St. 271, Phnom Penh, Cambodia',
            'latitude' => 11.5449,
            'longitude' => 104.9135
        ]);

        $p2 = \App\Models\Project::create([
            'name' => 'Tech Center (Siem Reap)',
            'description' => 'Storage for electronic components and server parts in Siem Reap',
            'address' => 'St. 06, Siem Reap, Cambodia',
            'latitude' => 13.3633,
            'longitude' => 103.8564
        ]);

        $p1->products()->createMany([
            ['name' => 'Steel Beam', 'sku' => 'SB-001', 'price' => 1500, 'stock' => 20],
            ['name' => 'Industrial Lift', 'sku' => 'IL-99', 'price' => 12500.50, 'stock' => 5],
        ]);

        $p2->products()->createMany([
            ['name' => 'Server Cabinet', 'sku' => 'SC-42U', 'price' => 850, 'stock' => 12],
            ['name' => 'CAT6 Cable (100m)', 'sku' => 'C6-100', 'price' => 45.99, 'stock' => 100],
        ]);
    }
}
