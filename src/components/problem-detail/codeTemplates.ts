
const codeTemplates = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Ваше решение здесь
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Ваше решение здесь
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Ваше решение здесь
        return new int[]{0, 0};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Ваше решение здесь
        return {0, 0};
    }
};`,
  csharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Ваше решение здесь
        return new int[]{0, 0};
    }
}`
};

export default codeTemplates;
