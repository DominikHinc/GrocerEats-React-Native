import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase('GrocerEats.db');

export const init_saved_recipes_db = () => {
console.log("Opening saved recipes db")
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS SavedRecipes (mealId INTEGER PRIMARY KEY NOT NULL, mealDetails TEXT NOT NULL);',
        [],
        () => {
          resolve()
        },
        (_, err) => {
          reject(err);
        }
      );
    })
  })
  return promise;
}

export const init_grocery_list_db = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS GroceryList (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUrl TEXT, amountMain TEXT NOT NULL, amountSecondary TEXT, unitMain TEXT NOT NULL, unitSecondary TEXT, aisle TEXT, isChecked INTEGER, willBeDeleted INTEGER);',
        [],
        () => {
          resolve()
        },
        (_, err) => {
          reject(err);
        }
      );
    })
  })
  return promise;
}

//Functions that change Saved Recipes Table
export const insertSavedRecipe = (mealId, mealDetails) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO SavedRecipes (mealId, mealDetails) VALUES (?, ?);`,
        [mealId, mealDetails],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const deleteSavedRecipe = (mealId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM SavedRecipes WHERE mealId = ?;`,
        [mealId],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const fetchSavedRecipes = () => {
console.log("Fetching saved recipes")
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SavedRecipes',
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

//Functions that change Grocery list

export const insertProduct = (id, title, imageUrl, amountMain, amountSecondary, unitMain, unitSecondary, aisle, isChecked, willBeDeleted) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO GroceryList (id, title, imageUrl, amountMain, amountSecondary, unitMain, unitSecondary, aisle, isChecked, willBeDeleted) VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,?);`,
        [id, title, imageUrl, amountMain.toString(), amountSecondary.toString(), unitMain, unitSecondary, aisle, isChecked === true ? 0 : 1, false],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const updateProduct = (targetId, id, title, imageUrl, amountMain, amountSecondary, unitMain, unitSecondary, aisle, isChecked, willBeDeleted)=>{
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE GroceryList SET id = ?, title = ?, imageUrl = ?, amountMain = ?, amountSecondary = ?, unitMain = ?, unitSecondary = ?, aisle = ?, isChecked = ? WHERE id = ?`,
        [id, title, imageUrl, amountMain, amountSecondary, unitMain, unitSecondary, aisle, isChecked === true ? 0 : 1, targetId],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const setProductAmount = (id, amountMain) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE GroceryList SET amountMain = ? WHERE id = ?`,
        [amountMain, id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const setProductCheck = (id, shouldBeChecked) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE GroceryList SET isChecked = ? WHERE id = ?`,
        [shouldBeChecked === true ? 0 : 1, id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const deleteProduct = (id) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM GroceryList WHERE id = ?;`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const deleteAllProducts = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM GroceryList;`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const fetchSavedProducts = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM GroceryList',
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};


