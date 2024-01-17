<template>
  <div>
    <q-layout>
      <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-primary'">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
          <q-toolbar-title>{{ user }}</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <q-item full-width>
          <q-item-section>
            <q-btn color="negative" text-color="white" @click="logoutUser" label="Logout" />
          </q-item-section>
        </q-item>
      </q-drawer>

      <q-page-container>

        <div class="containerr">
          <div style="flex: 40%; margin-right: 20px;">
            <q-card class="rounded">
              <q-card-section class="bg-primary text-h6 text-white text-center">
                Leave Request Form
              </q-card-section>
              <q-card-section>
                <q-input outlined label="Days" v-model="Days" type="number" min="0.5" step="0.5" @input="updateDateTo" />
                <q-input outlined label="Date From" v-model="DateFrom" type="date" @change="updateDateTo" />
                <q-input outlined label="Date To" v-model="DateTo" type="date" @change="updateDays" />
                <q-input outlined label="Time From" v-model="TimeFrom" type="time" />
                <q-input outlined label="Time To" v-model="TimeTo"  type="time" />
                <q-select
                  v-model="LeaveType"
                  label="Leave Type"
                  outlined
                  dense
                  required
                  :options="LeaveTypes"
                />
                <q-input outlined v-model="Reason" label="Reason for Leave"></q-input>
                <br />
                <div class="text-center">
                  <q-btn push color="blue" text-color="white" label="Submit Application" @click="submitLeaveRequest" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div style="flex: 60%;">
            <q-card class="rounded">
              <q-card-section class="bg-primary text-white text-h6 text-center">
                Leave Details
              </q-card-section>
              <q-virtual-scroll
                class="virtual-scroll"
                type="table"
                style="max-height: 400px"
                :virtual-scroll-item-size="48"
                :virtual-scroll-sticky-size-start="48"
                :virtual-scroll-sticky-size-end="32"
                :items="sortedLeaveBalance"
              >
                <template v-slot:before>
                  <thead class="sticky-thead">
                    <tr>
                      <th v-for="col in balancecolumns" :key="col.name">
                        {{ col.name }}
                      </th>
                    </tr>
                  </thead>
                </template>

                <template v-slot="{ item: row, Year }">
                  <q-tr :key="Year">
                    <q-td v-for="col in balancecolumns" :key="col.Year" class="text-center">
                      {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : row[col.field] }}
                    </q-td>
                  </q-tr>
                </template>
              </q-virtual-scroll>
            </q-card>
          </div>
          
        </div>



        <div v-if="isAdmin" class="text-center" style="margin-top: 5px; margin-bottom: 0;">
          <q-btn class="bg-orange text-white" @click="leaveAction = true">Pending Leave</q-btn>
        </div>


        <div class="containerr2">

          <div style="flex: 100%;">
            <q-card class="rounded1">
              <q-card-section class="bg-primary text-white text-h6 text-center">
                Leave History
              </q-card-section>
              <q-virtual-scroll
                class="virtual-scroll"
                type="table"
                style="max-height: 600px"
                :virtual-scroll-item-size="48"
                :virtual-scroll-sticky-size-start="48"
                :virtual-scroll-sticky-size-end="32"
                :items="sortedLeaveDetails"
              >
                <template v-slot:before>
                  <thead class="sticky-thead">
                    <tr>
                      <th v-for="col in leavecolumns" :key="col.name">
                        {{ col.name }}
                      </th>
                    </tr>
                  </thead>
                </template>
                <template v-slot="{ item: row, LeaveID }">
                  <q-tr :key="LeaveID">
                    <q-td v-for="col in leavecolumns" :key="col.LeaveID" class="text-center">
                      {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'DateFrom' || col.field === 'DateTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                      <template v-if="col.name === 'Actions'">
                        <template v-if="row.Status === 'Rejected'">
                          <q-card style="max-width: 95%; margin-left: 3.5px;">
                            <q-card-section class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                              Rejected
                            </q-card-section>
                          </q-card>
                        </template>
                        <template v-else-if="row.Status === 'Approved'">
                          <q-card class="bg-positive text-white" style="max-width: 95%; margin-left: 3.5px;">
                            <q-card-section class="text-h6 text-center" style="line-height: 25%;">
                              Approved
                            </q-card-section>
                          </q-card>
                        </template>
                        <template v-else>
                          <q-card style="max-width: 95%; margin-left: 3.5px;">
                            <q-btn
                              @click="editLeave(row.LeaveID)"
                              icon="edit"
                              color="primary"
                              style="width: 45%; margin-right: 10%;"
                            />
                            <q-btn
                              @click="deleteLeave(row.LeaveID)"
                              icon="delete"
                              color="negative"
                              style="width: 45%;"
                            />
                          </q-card>
                          <q-card class="bg-positive text-white" style="max-width: 95%; margin-left: 3.5px;">
                            <q-btn
                              @click="generatePDFForEntry(row)"
                              label="Print PDF"
                              color="primary"
                              style="line-height: 50%; min-width: 100%">
                              <q-icon class="pdf-icon" name="picture_as_pdf" size="20px" />
                            </q-btn>
                          </q-card>
                        </template>
                      </template>
                    </q-td>
                  </q-tr>
                </template>
              </q-virtual-scroll> 
            </q-card>
          </div>
        </div>


        <q-dialog v-model="editDialog">
          <q-card class="rounded" style="min-height: 400px; min-width: 450px;">
            <q-card-section class="bg-primary text-white text-h6 text-center">
              Edit Leave Form
            </q-card-section>
            <q-card-section>
              <q-input outlined label="Days" v-model="Dayss" type="number" min="0.5" step="0.5" @input="updateDateTo" />
              <q-input outlined label="Date From" v-model="DateFromm" type="date" @change="updateDateTo" />
              <q-input outlined label="Date To" v-model="DateToo" type="date" @change="updateDays" />
              <q-input outlined label="Time From" v-model="TimeFromm" type="time" />
              <q-input outlined label="Time To" v-model="TimeToo" type="time" />
              <q-select
                v-model="LeaveType2"
                label="Leave Type"
                outlined
                dense
                required
                :options="LeaveTypes"
              />
              <q-input outlined v-model="Reason" label="Reason for Leave"></q-input>
              <br>
              <q-btn color="primary" class="q-mr-xs" @click="updateLeave" label="Submit" />
              <q-btn color="red" class="q-mr-xs" @click="cancelEdit" label="Cancel" />
            </q-card-section>
          </q-card>
        </q-dialog>


        <q-dialog v-model="leaveAction">
          <q-card class="rounded3">
            <q-card-section class="bg-primary text-white text-h6 text-center">
              Leave Details
            </q-card-section>
            <q-virtual-scroll
              type="table"
              class="virtual-scroll"
              style="max-height: 600px"
              :virtual-scroll-item-size="48"
              :virtual-scroll-sticky-size-start="48"
              :virtual-scroll-sticky-size-end="32"
              :items="sortedPendingLeave"
            >
              <template v-slot:before>
                <thead class="text-center">
                  <tr>
                    <th v-for="col in pendingcolumns" :key="col.name">
                      {{ col.name }}
                    </th>
                  </tr>
                </thead>
              </template>

              <template v-slot="{ item: row, LeaveID }">
                <q-tr :key="LeaveID">
                  <q-td v-for="col in pendingcolumns" :key="col.LeaveID" class="text-center">
                    {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'DateFrom' || col.field === 'DateTo' ? formatDateTime(row[col.field]) : row[col.field] }}

                    <template v-if="col.name === 'Actions'">
                      <template v-if="isAdmin">
                        <q-btn
                          @click="approveLeave(row.LeaveID)"
                          icon="check_circle"
                          color="green"
                          label="Approve"
                          class="q-mr-xs"
                        />
                        <q-btn
                          @click="rejectLeave(row.LeaveID)"
                          icon="cancel"
                          color="negative"
                          label="Reject"
                        />
                      </template>
                    </template>
                  </q-td>
                </q-tr>
              </template>
            </q-virtual-scroll>
          </q-card>
        </q-dialog>

      </q-page-container>
    </q-layout>
  </div>
</template>




<script>
import logoPath from '../assets/logouerm.jpg';
import { Cookies } from 'quasar';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  data() {
    return {
      base64Image: '',
      backgroundImage: null,
      leaveAction: false,
      leftDrawerOpen: false,
      centerDrawerOpen: false,
      Days: null,
      TimeFrom: null,
      TimeTo: null,
      DateFrom: null,
      DateTo: null,
      Dayss: null,
      TimeFromm: null,
      TimeToo: null,
      DateFromm: null,
      DateToo: null,
      LeaveType: null,
      LeaveTypes: [
        { label: 'Vacation Leave', value: 'VL' },
        { label: 'Sick Leave', value: 'SL' },
        { label: 'Emergency Leave', value: 'EL' },
      ],
      LeaveDetails: [],
      leavecolumns: [
        { name: 'LeaveID', label: 'LeaveID',  align: 'center',  field: 'LeaveID'},
        { name: 'Days', label: 'Days', align: 'center', field: 'Days', sortable: false },
        { name: 'TimeFrom', label: 'Time From', align: 'center', field: 'TimeFrom', sortable: false },
        { name: 'TimeTo', label: 'Time To', align: 'center', field: 'TimeTo', sortable: false },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'DateFrom', sortable: false },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'DateTo', sortable: false },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'LeaveType', sortable: false },
        { name: 'Status', label: 'Status', align: 'center', field: 'Status', sortable: false },
        { name: 'Actions', label: 'Actions', align: 'center', field: 'id', sortable: false },
      ],
      editDialog: false,
      editLeaveID: null,
      pendingLeave: [],
      pendingcolumns: [
        { name: 'LeaveID', label: 'Leave ID', align: 'left', field: 'LeaveID', sortable: false },
        { name: 'UserID', label: 'User ID', align: 'left', field: 'UserID', sortable: false },
        { name: 'Days', label: 'Days', align: 'left', field: 'Days', sortable: false },
        { name: 'TimeFrom', label: 'Time From', align: 'left', field: 'TimeFrom', sortable: false },
        { name: 'TimeTo', label: 'Time To', align: 'left', field: 'TimeTo', sortable: false },
        { name: 'DateFrom', label: 'Date From', align: 'left', field: 'DateFrom', sortable: false },
        { name: 'DateTo', label: 'Date To', align: 'left', field: 'DateTo', sortable: false, },
        { name: 'LeaveType', label: 'Leave Type', align: 'left', field: 'LeaveType', sortable: false},
        { name: 'Status', label: 'Status', align: 'left', field: 'Status', sortable: false},
        { name: 'Actions', label: 'Actions', align: 'center', field: 'id', sortable: false },
      ],
      leaveBalance: [],
      balancecolumns: [
        { name: 'Year', label: 'Year', align: 'center', field: 'Year', sortable: false},
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'LeaveType', format: (val) => this.LeaveTypeLabels[val], sortable: false},
        { name: 'Balance', label: 'Balance', align: 'center', field: 'Balance', sortable: false},
      ],
    };
  },

  computed: {

    sortedLeaveBalance() {
      return this.leaveBalance.sort((a, b) => b.Year - a.Year);
    },
    
    sortedLeaveDetails() {
      return this.LeaveDetails.sort((a, b) => b.LeaveID - a.LeaveID);
    },

    sortedPendingLeave() {
      return this.pendingLeave.sort((a, b) => b.LeaveID - a.LeaveID);
    },

    user() {
      return this.$store.state.auth.user;
    },
    UserID() {
      return this.$store.state.auth.UserID;
    },
    LeaveTypeLabels() {
      return this.LeaveTypes.reduce((acc, LeaveType) => {
        acc[LeaveType.value] = LeaveType.label;
        return acc;
      }, {});
    },
    isAdmin() {
      const token = Cookies.get('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.isAdmin === true; // Fix: Check if isAdmin is true
      }
      return false;
    },

    isNotAdmin() {
      return !this.isAdmin();
    },
    summarizedLeaveBalance() {
      const leaveTypeSummary = {};
      this.leaveBalance.forEach((balance) => {
        const leaveType = balance.LeaveType;
        const year = balance.Year;
        const balanceValue = balance.Balance;

        if (!leaveTypeSummary[leaveType]) {
          leaveTypeSummary[leaveType] = { LeaveType: leaveType, TotalBalance: 0 };
        }

        leaveTypeSummary[leaveType].TotalBalance += balanceValue;
      });
      const summarizedData = Object.values(leaveTypeSummary);
      return summarizedData;
    },

    base64Image() {
      return this.$store.getters['leaveModule/base64Image'];
    },
  },

  methods: {

    loadAndConvertToBase64() {
      this.$store.dispatch('leaveModule/loadAndConvertToBase64', logoPath);
    },

    generatePDFForEntry(entry) {

    if (!entry || !entry.LeaveID || !entry.Days || !entry.TimeFrom || !entry.DateFrom || !entry.DateTo || !entry.LeaveType) {
      console.error("Invalid entry data.");
      return;
    };

    const currentDate = new Date().toLocaleDateString();
    const summarizedLeaveBalance = this.summarizedLeaveBalance; 
    const leaveDetails = [];
    const leaveDetailss = [];

    summarizedLeaveBalance.forEach(item => {
      const leaveTypeLabels = this.LeaveTypeLabels[item.LeaveType];
      let additionalMessage = '';

      if (item.LeaveType === 'SL') {
        additionalMessage = ' (Attach Medical Certificate issued by the Infirmary Physician)';
      };
      if (item.LeaveType === 'EL') {
        additionalMessage = ' (Attach proof of emergency such as calamity, death, serious illness, and serious accident of a member of the immediate family)';
      };

      leaveDetails.push([
        {
          text: item.TotalBalance.toString(),
          alignment: 'center',
          border: [false, false, false, false],
          style: 'cool',
          decoration: 'underline',
          decorationColor: 'black',
        },
        {
          text: leaveTypeLabels + additionalMessage,
          alignment: 'left',
          border: [false, false, false, false],
          style: 'cool',
        },
      ]);

      leaveDetailss.push([
        {
          text: item.TotalBalance.toString(),
          alignment: 'center',
          border: [false, false, false, false],
          style: 'cool',
          decoration: 'underline',
          decorationColor: 'black',
        },
        {
          text: leaveTypeLabels + additionalMessage,
          alignment: 'left',
          border: [false, false, false, false],
          style: 'cool',
        },
      ]);

    });

    leaveDetailss.push([
      { text: '', alignment: 'center', border: [false, false, false, false], style: 'cool' },
      {
        text: 'Others, please specify: _________________________________________',
        alignment: 'left',
        border: [false, false, false, false],
        style: 'cool',
      },
    ]);

    leaveDetails.push([
      { text: '', alignment: 'center', border: [false, false, false, false], style: 'cool' },
      {
        text: 'Others, please specify: _________________________________________',
        alignment: 'left',
        border: [false, false, false, false],
        style: 'cool',
      },
    ]);

    const docDefinition = {
      pageSize: {
        width: 8.5 * 72,
        height: 13 * 72,
      },
      pageMargins: [20, 10],
      background: [
        {
          image: this.base64Image,
          width: 350,
          height: 250,
          alignment: 'center',
          absolutePosition: { x: 0, y: (11 * 72) * 0.25 - (250 * 0.5), }, // Middle of the top 50% of the page
        },
        {
          image: this.base64Image,
          width: 350,
          height: 250,
          alignment: 'center',
          absolutePosition: { x: 0, y: (11 * 72) * 0.75 - (250 * 0.5), }, // Middle of the bottom 50% of the page
        },
      ],

      content: [
        {
          stack: [
            { text: '\n' },
            { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC', style: 'header', alignment: 'center' },
            { text: 'LEAVE APPLICATION FORM', alignment: 'center', style: 'app' },
            {
              table: {
                widths: ['*', '*', '*'],
                body: [
                  [
                    { text: `DATE FILE: ${currentDate}`, border: [false, false, false, false], style: 'dp' },
                    { text: 'POSITION DESCRIPTION', alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: ``, border: [false, false, false, false] }
                  ],
                ],
              }
            },

            {
              table: {
                widths: ['*', '*', '*', '*', '*'],
                body: [
                  [
                    { text: 'CODE', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'NAME', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'POSITION', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'STATUS', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                  ],

                  [
                    { text: `${this.UserID}`, alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: `${this.user}`, alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'POSITION', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'STATUS', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                  ],
                ],
              }
            },

            { text: ' ', fontSize: 5 },
            { text: 'Leave Details', alignment: 'center', style: 'app' },
            {
              table: {
                widths: ['25%', '75%'],
                body: [
                  [
                    { text: 'CREDITS', alignment: 'center', border: [false, false, false, false], style: 'cool' },
                    { text: 'LEAVE TYPE', border: [false, false, false, false], style: 'cool' },
                  ],
                  ...leaveDetails
                ],
              },
            },

            { text: ' ', fontSize: 8 },
            { text: 'Leave Application Details', alignment: 'center', style: 'app' },
            { text: ' ', fontSize: 5 },
            {
              table: {
                widths: ['20%', '10%', '15%', '15%', '40%'],
                body: [
                  [
                    { text: 'Leave Type', style: 'leaveDets' },
                    { text: 'Days', style: 'leaveDets' },
                    { text: 'Date From', style: 'leaveDets' },
                    { text: 'Date To', style: 'leaveDets' },
                    { text: 'Reason', style: 'leaveDets'}
                  ],
                  [
                    { text: this.LeaveTypeLabels[entry.LeaveType], style: 'leaveInfo' },
                    { text: entry.Days, style: 'leaveInfo' },
                    { text: this.formatDateTime(entry.DateFrom), style: 'leaveInfo' },
                    { text: this.formatDateTime(entry.DateTo), style: 'leaveInfo' },
                    { text: entry.Reason, style: 'leaveInfo' },
                  ]
                ]
              }
            },

            { text: '\n\n\n' },
            {
              table: {
                widths: ['*', '*', '*'],
                body: [
                  [
                    { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' }
                  ],
                  [
                    { text: `EMPLOYEE SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `DEPARTMENT HEAD SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `HUMAN RESOURCE PERSONNEL SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' }
                  ]
                ],
              }
            },
            { text: ' ', fontSize: 14 },
            { text: ' _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ', border: [false, false, false, false] }
          ],
        },
        {
          margin: [0, 20, 0, 0],
          stack: [
            { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC', style: 'header', alignment: 'center' },
            { text: 'LEAVE APPLICATION FORM', alignment: 'center', style: 'app' },
            {
              table: {
                widths: ['*', '*', '*'],
                body: [
                  [
                    { text: `DATE FILE: ${currentDate}`, border: [false, false, false, false], style: 'dp' },
                    { text: 'POSITION DESCRIPTION', alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: ``, border: [false, false, false, false] }
                  ],
                ],
              }
            },
            {
              table: {
                widths: ['*', '*', '*', '*', '*'],
                body: [
                  [
                    { text: 'CODE', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'NAME', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'POSITION', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'STATUS', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                  ],

                  [
                    { text: `${this.UserID}`, alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: `${this.user}`, alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'POSITION', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                    { text: 'STATUS', alignment: 'center', border: [false, false, false, false], style: 'cool', fillColor: '#cccccc' },
                  ],
                ],
              }
            },
            { text: ' ', fontSize: 5 },
            { text: 'Leave Details', alignment: 'center', style: 'app' },
            {
              table: {
                widths: ['25%', '75%'],
                body: [
                  [
                    { text: 'CREDITS', alignment: 'center', border: [false, false, false, false], style: 'cool' },
                    { text: 'LEAVE TYPE', border: [false, false, false, false], style: 'cool' },
                  ],
                  ...leaveDetailss
                ],
              },
            },
            { text: ' ', fontSize: 8 },
            { text: 'Leave Application Details', alignment: 'center', style: 'app' },
            { text: ' ', fontSize: 5 },
            {
              table: {
                widths: ['20%', '10%', '15%', '15%', '40%'],
                body: [
                  [
                    { text: 'Leave Type', style: 'leaveDets' },
                    { text: 'Days', style: 'leaveDets' },
                    { text: 'Date From', style: 'leaveDets' },
                    { text: 'Date To', style: 'leaveDets' },
                    { text: 'Reason', style: 'leaveDets'}
                  ],
                  [
                    { text: this.LeaveTypeLabels[entry.LeaveType], style: 'leaveInfo' },
                    { text: entry.Days, style: 'leaveInfo' },
                    { text: this.formatDateTime(entry.DateFrom), style: 'leaveInfo' },
                    { text: this.formatDateTime(entry.DateTo), style: 'leaveInfo' },
                    { text: entry.Reason, style: 'leaveInfo' },
                  ]
                ]
              }
            },
            { text: '\n\n\n' },
            {
              table: {
                widths: ['*', '*', '*'],
                body: [
                  [
                    { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' }
                  ],
                  [
                    { text: `EMPLOYEE SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `DEPARTMENT HEAD SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                    { text: `HUMAN RESOURCE PERSONNEL SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' }
                  ]
                ],
              }
            },
          ],
        },
      ],

      styles: {
        header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
        headerr: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
        app: { fontSize: 11, bold: true },
        cool: { fontSize: 9, bold: true },
        dp: { fontSize: 9, bold: true },
        leaveDets: { fontSize: 9, bold: true, alignment: 'center' },
        leaveInfo: { fontSize: 9, bold: true, alignment: 'center' },
      },
    };


    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBlob((blob) => {
      const newWindow = window.open();
      const url = URL.createObjectURL(blob);
      newWindow.location.href = url;
    });

    },


  


    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    async submitLeaveRequest() {
      if (!this.Days || !this.TimeFrom || !this.TimeTo || !this.DateFrom || !this.DateTo || !this.LeaveType) {
        console.log('Input the required fields');
        return;
      }

      const leaveRequestData = {
        Days: this.Days,
        TimeFrom: this.TimeFrom,
        TimeTo: this.TimeTo,
        DateFrom: this.DateFrom,
        DateTo: this.DateTo,
        LeaveType: this.LeaveType.value,
        Reason: this.Reason,
      };

      try {
        await this.$store.dispatch('leaveModule/submitLeaveRequest', leaveRequestData);

        this.Days = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.DateFrom = null;
        this.DateTo = null;
        this.LeaveType = null;
        this.Reason = null;
        this.fetchpendingLeaves();
        this.fetchLeaves();
        console.log('Success Leave Application');
      } catch (error) {
        console.error('Failed to add leave', error);
      }
    },

    async fetchLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchLeaves');
        this.LeaveDetails = this.$store.state.leaveModule.leaveDetails;
        console.log('Success getting the Leave History');
      } catch (error) {
        console.log('Failed getting Leave Details', error);
      }
    },

    async deleteLeave(leaveId) {
      try {
        await this.$store.dispatch('leaveModule/deleteLeaves', leaveId);
        console.log('Leave request deleted successfully.');
        this.fetchLeaves();
      } catch (error) {
        console.error('Error Deleting Leave');
      }
    },

    editLeave(leaveId) {
      this.editDialog = true;
      this.editLeaveID = leaveId;
    },

    cancelEdit() {
      this.editDialog = false;
      this.leaveIdToEdit = null;
      this.Dayss = null;
      this.TimeFromm = null;
      this.TimeToo = null;
      this.DateFromm = null;
      this.DateToo = null;
      this.LeaveType2 = null;
    },

    async updateLeave() {
      const updatedLeave = {
        Days: this.Dayss,
        TimeFrom: this.TimeFromm,
        TimeTo: this.TimeToo,
        DateFrom: this.DateFromm,
        DateTo: this.DateToo,
        LeaveType: this.LeaveType2.value,
        editLeaveID: this.editLeaveID,
      };

      try {
        if (!this.Dayss || !this.TimeFromm || !this.TimeToo || !this.DateFromm || !this.DateToo || !this.LeaveType2) {
          console.log('Input the required fields');
          return;
        }

        await this.$store.dispatch('leaveModule/updateLeaves', updatedLeave);

        console.log('Leave request updated successfully.');
        this.editDialog = false;
        this.Dayss = null;
        this.TimeFromm = null;
        this.TimeToo = null;
        this.DateFromm = null;
        this.DateToo = null;
        this.LeaveType2 = null;
        this.fetchLeaves();
        this.fetchpendingLeaves();
      } catch (error) {
        console.error('Error Updating Leave', error);
      }
    },

    async fetchpendingLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchpendingLeaves');
        console.log('Success getting Pending Leaves');
        this.pendingLeave = this.$store.state.leaveModule.pendingDetails;
      } catch (error) {
        console.error('Failed to get pending leaves / Admin Only');
      }
    },

    async approveLeave(leaveId) {
      try {
        await this.$store.dispatch('leaveModule/approveLeaves', leaveId);
        console.log('Leave request approved successfully');
        this.fetchpendingLeaves();
        this.fetchLeaves();
        this.fetchleaveBalance();
        this.leaveAction = false;
      } catch (error) {
        console.error('Failed approving the leave', error);
      }
    },

    async rejectLeave(leaveId) {
      try {
        await this.$store.dispatch('leaveModule/rejectLeaves', leaveId);
        console.log('Leave request rejected successfully');
        this.fetchpendingLeaves();
        this.fetchLeaves();
      } catch (error) {
        console.error('Error rejecting leave request:', error);
      }
    },

    async fetchleaveBalance() {
      try {
        await this.$store.dispatch('leaveModule/fetchleaveBalances');
        console.log('Success getting the Leave Balance');
        this.leaveBalance = this.$store.state.leaveModule.balanceDetails;
      } catch (error) {
        console.error('Failed to get Leave Balance', error);
      }
    },

    updateDateTo() {
      if (this.DateFrom && this.Days) {
        const fromDate = new Date(this.DateFrom);

        if (!isNaN(fromDate.getTime()) && this.Days > 0) {
          const totalMilliseconds = ((this.Days - 1) * 24 * 60 * 60 * 1000) + 
          (0.5 * 24 * 60 * 60 * 1000);
          const toDate = new Date(fromDate.getTime() + totalMilliseconds);
          this.DateTo = toDate.toISOString().split('T')[0];
        }
      }
    },

    updateDays() {
      if (this.DateFrom && this.DateTo) {
        const fromDate = new Date(this.DateFrom);
        const toDate = new Date(this.DateTo);
        const totalMilliseconds = toDate.getTime() - fromDate.getTime();
        const totalDays = Math.ceil(totalMilliseconds / (24 * 60 * 60 * 1000));
        this.Days = totalDays + 1;
      }
    },

      

    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    async fetchUserData() {
      try {
        await this.$store.dispatch('auth/fetchUserData');
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    },

    async logoutUser() {
      await this.$store.dispatch('auth/logoutUser');
      this.$store.dispatch('leaveModule/clearLeaveDetails');
      this.$router.push('/');
    },

  },

  watch: {
    DateFrom: 'updateDateTo',
    DateTo: 'updateDays',
    Days: 'updateDateTo',
  },

  created() {
    this.fetchLeaves();
    this.fetchpendingLeaves();
    this.fetchleaveBalance();
    this.fetchUserData();
    this.loadAndConvertToBase64();
  },
};
</script>


<style>


.containerrr {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.rounded {
  overflow-y: auto;
  margin: 0 auto;
  border-radius: 10px;
  padding-bottom: 0px;
  margin-bottom: 50px;
  margin-top: 10px;
  min-height: 530px;
}


.rounded1 {
  overflow-y: auto;
  margin: 0 auto;
  border-radius: 10px;
  padding-bottom: 0px;
  min-height: 450px;
}


.rounded3 {
  min-width: 1200px;
}


.sticky-thead {
  position: sticky;
  top: 0;
  background-color: #eeeeee;
  z-index: 1;
}


.containerr {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 85%;
  margin: 0 auto 0 ;
}


.containerr2 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 85%;
  margin: 0 auto;
  margin-bottom: 50px;
}

.TextContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.Text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}



</style>