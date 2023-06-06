<script>
import { useTradeStore } from '../stores/store';
import { mapActions, mapState } from 'pinia';

export default {
    name: 'MainPage',
    methods: {
    },
    computed: {
        ...mapState(useTradeStore, ['stakingData'])
    },
    methods: {
        ...mapActions(useTradeStore, ['fetchStakings', 'fetchDeposits', 'getSummary'])
    },
    created() {
        this.fetchStakings()
    }
}
</script>

<template>
    <main class="main-content max-height-vh-100 h-100">
        <div class="container my-3 py-3">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex align-items-center mb-4">
                        <h3 class="mb-1 font-weight-bold">
                            Earnings
                        </h3>
                    </div>
                </div>
            </div>
            <hr class="horizontal mb-4 dark">
            <div class="row">
                <div class="col-md-4">
                    <h6 class="text-sm font-weight-semibold mb-1">Staking rewards</h6>
                    <p class="text-sm">We'll credit your account periodically for staking interests. <br> Here is your
                        earning
                        history.</p>
                </div>
                <div class="col-md-8 mb-6">
                    <div class="card shadow-xs border mb-4">
                        <div class="table-responsive p-0">
                            <table class="table align-items-center mb-0">
                                <thead>
                                    <tr>
                                        <th class="d-flex align-items-center py-3 px-4 text-sm">
                                            <div class="form-check mb-0">
                                            </div>
                                            <span class="text-xs font-weight-semibold opacity-7 ms-1">All rewards</span>
                                        </th>
                                        <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Status</th>
                                        <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Amount</th>
                                        <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Timestamp
                                        </th>
                                        <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="staking in stakingData" :key="staking.id">
                                        <td class="d-flex align-items-center py-3 px-4 text-sm">
                                            <span class="font-weight-semibold text-dark ms-1">{{ staking.name }}</span>
                                        </td>
                                        <td>
                                            <span
                                                class="badge badge-sm border border-success text-success bg-success border-radius-sm">
                                                <svg width="9" height="9" viewBox="0 0 10 9" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="me-1">
                                                    <path d="M1 4.42857L3.28571 6.71429L9 1" stroke-width="2"
                                                        stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                {{ staking.status }}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="text-sm">{{ staking.amount.toLocaleString("id-ID", {
                                                style:
                                                    "currency", currency: "IDR"
                                            }) }}</span>
                                        </td>
                                        <td>
                                            <span class="text-sm">{{ staking.updatedAt }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer pt-3  ">
            <div class="container-fluid">
                <div class="row align-items-center justify-content-lg-between">
                    <div class="col-lg-6 mb-lg-0 mb-4">
                        <div class="copyright text-center text-xs text-muted text-lg-start">
                            Copyright © 2023
                            PasarKoin. Design by
                            <a href="https://www.creative-tim.com" class="text-secondary" target="_blank">Creative
                                Tim</a>.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </main>
</template>