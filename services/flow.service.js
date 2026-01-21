/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// this object is generated from Flow Builder under "..." > Endpoint > Snippets > Responses
// To navigate to a screen, return the corresponding response from the endpoint. Make sure the response is encrypted.
const SCREEN_RESPONSES = {
  LANGUAGE: {
    screen: "LANGUAGE",
    data: {}
  },
  USER_DETAILS: {
    screen: "USER_DETAILS",
    data: {
      time_slots: [
        { "id": "0", "title": "00:00" },
        { "id": "1", "title": "00:30" },
        { "id": "2", "title": "01:00" },
        { "id": "3", "title": "02:00" },
        { "id": "4", "title": "02:30" },
        { "id": "5", "title": "03:00" },
        { "id": "6", "title": "03:30" },
        { "id": "7", "title": "04:00" },
        { "id": "8", "title": "04:30" },
        { "id": "9", "title": "05:00" },
        { "id": "10", "title": "05:30" },
        { "id": "11", "title": "06:00" },
        { "id": "12", "title": "06:30" },
        { "id": "13", "title": "07:00" },
        { "id": "14", "title": "07:30" },
        { "id": "15", "title": "08:00" },
        { "id": "16", "title": "08:30" },
        { "id": "17", "title": "09:00" },
        { "id": "18", "title": "09:30" },
        { "id": "19", "title": "10:00" },
        { "id": "20", "title": "10:30" },
        { "id": "21", "title": "11:00" },
        { "id": "22", "title": "11:30" },
        { "id": "23", "title": "12:00" },
        { "id": "24", "title": "12:30" },
        { "id": "25", "title": "13:00" },
        { "id": "26", "title": "13:30" },
        { "id": "27", "title": "14:00" },
        { "id": "28", "title": "14:30" },
        { "id": "29", "title": "15:00" },
        { "id": "30", "title": "15:30" },
        { "id": "31", "title": "16:00" },
        { "id": "32", "title": "16:30" },
        { "id": "33", "title": "17:00" },
        { "id": "34", "title": "17:30" },
        { "id": "35", "title": "18:00" },
        { "id": "36", "title": "18:30" },
        { "id": "37", "title": "19:00" },
        { "id": "38", "title": "19:30" },
        { "id": "39", "title": "20:00" },
        { "id": "40", "title": "20:30" },
        { "id": "41", "title": "21:00" },
        { "id": "42", "title": "21:30" },
        { "id": "43", "title": "22:00" },
        { "id": "44", "title": "22:30" },
        { "id": "45", "title": "23:00" },
        { "id": "46", "title": "23:30" }
      ],
      selected_DoB: "2025-12-24",
      selected_ToB: "2",
    },
  },
  PROBLEM: {
    screen: "PROBLEM",
    data: {
      problem: [
        {id: "1", title: "Marriage delay"},
        {id: "2", title: "Marriage not fixing"},
        {id: "3", title: "Love marriage obstacles"},
        {id: "4", title: "Inter-caste / family opposition"},
        {id: "5", title: "Breakup / separation pain"},
        {id: "6", title: "Divorce problems"},
        {id: "7", title: "Husband-wife fights"},
        {id: "8", title: "Lack of bonding"},
        {id: "9", title: "Extra-marital suspicion"},
        {id: "10", title: "Kundli mismatch fear"},
        {id: "11", title: "Job not getting"},
        {id: "12", title: "Frequent job change"},
        {id: "13", title: "Job insecurity"},
        {id: "14", title: "Career growth blocked"},
        {id: "15", title: "Office politics"},
        {id: "16", title: "Boss problems"},
        {id: "17", title: "Transfer issues"},
        {id: "18", title: "Govt job delay"},
        {id: "19", title: "Exam failure"},
        {id: "20", title: "Career confusion"},
        {id: "21", title: "Business losses"},
        {id: "22", title: "Sudden downfall"},
        {id: "23", title: "Debt pressure"},
        {id: "24", title: "Cash flow problems"},
        {id: "25", title: "Partnership dispute"},
        {id: "26", title: "Business not growing"},
        {id: "27", title: "Investment losses"},
        {id: "28", title: "Property dispute"},
        {id: "29", title: "Legal money cases"},
        {id: "30", title: "Sudden expenses"},
        {id: "31", title: "Chronic illness"},
        {id: "32", title: "Mental stress / anxiety"},
        {id: "33", title: "Sleep disorder"},
        {id: "34", title: "Reproductive health"},
        {id: "35", title: "Child health"},
        {id: "36", title: "Accidents fear"},
        {id: "37", title: "Surgery fear"},
        {id: "38", title: "Long illness recovery"},
        {id: "40", title: "Infertility issues"},
        {id: "41", title: "Child education problems"},
        {id: "42", title: "Child going wrong path"},
        {id: "43", title: "Disobedient childrens"},
        {id: "44", title: "Family conflicts"},
        {id: "45", title: "In-law problems"},
        {id: "46", title: "Bad luck feeling"},
        {id: "47", title: "Negative energy fear"},
        {id: "48", title: "Repeated failures"},
        {id: "49", title: "Sudden shocks in life"},
        {id: "50", title: "Life purpose confusion"},
      ]
    },
  },
  COMPLETE: {
    screen: "COMPLETE",
    data: {},
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "flows-builder-0cdb6584",
          some_param_name: "PASS_CUSTOM_VALUE",
        },
      },
    },
  },
};

const getNextScreen = (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  
  // handle health check request
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  // handle error notification
  if (data?.error) {
    console.warn("Received client error:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display LOAN screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.LANGUAGE,
    };
  }

  if (action === "data_exchange") {
    console.log("👌", data);
    // handle the request based on the current screen
    switch (screen) {
      // handles when user interacts with LOAN screen
      case "LANGUAGE":
        // Handles user clicking on Continue to navigate to next screen
        return {
          ...SCREEN_RESPONSES.USER_DETAILS,
        };
      case "USER_DETAILS":
        if (data.continue != null) {
          return {
            ...SCREEN_RESPONSES.PROBLEM,
          };
        }

        // Refresh quote based on user selection
        return {
          ...SCREEN_RESPONSES.USER_DETAILS,
          data: {
            selected_DoB: data.DoB,
            selected_ToB: data.ToB,
          },
        };
      case "PROBLEM":
        // Handles user selecting UPI or Banking selector
        if (data.continue != null) {
          return {
            ...SCREEN_RESPONSES.COMPLETE,
          };
        }
        // Handles user clicking on Continue

        return {
          ...SCREEN_RESPONSES.PROBLEM,
          data: {
            // copy initial screen data then override specific fields
            selected_problem: data.problem,
          },
        };
      default:
        break;
    }
  }

  if(action === "success"){
    return {
      ...SCREEN_RESPONSES.SUCCESS,
    };
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};

module.exports = { getNextScreen };