async function upgradeUser(userId) {
  const userUpgradeResponse = await fetch(`/api/premium/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await userUpgradeResponse.json();

  if (!userUpgradeResponse.ok) {
    throw new Error(`Error while upgrading user`);
  }

  window.location.reload();
  alert(result);
}

async function deleteUser(userId) {
  const userDeleteResponse = await fetch(`/api/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await userDeleteResponse.json();

  if (!userDeleteResponse.ok) {
    throw new Error(`Error while deleting user`);
  }

  window.location.reload();
  alert(result.message);
}
